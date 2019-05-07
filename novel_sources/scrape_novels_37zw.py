import requests
from bs4 import BeautifulSoup
import random
import asyncio
from concurrent.futures import ThreadPoolExecutor
import json
import os
from bs4 import BeautifulSoup
from pypinyin import lazy_pinyin
import sys
sys.setrecursionlimit(1500)
# ==========================函数名目录：=============================================
#--------------------------------------进入包含所有小说的页面,生成【小说名】表，储存为json格式
# def fetch_novel_name_table    
#--------------------------------------从本地获取【小说名】表，并返回
#def get_novel_name_table_from_local():
#--------------------------------------从单个小说目录页面生成单个novel_category_table的json文件。
# def get_novel_category_table(soup,novel_id,novel_category_url):
#--------------------------------------成功连接目录页面后进行‘抓取数据’操作
# def fetch(session,novel_name,headers,proxies,novel_name_table):
#--------------------------------------启动进入目录页面的【异步】连接操作
# async def get_novel_category_tables(novel_name_table):
#--------------------------------------获取单个小说目录【表】，异步连接的启动接口
# def start_category_scrape(novel_name_table):
#-------------------------------------- 修补novel_name_table中novel_cover_img_link的细微错误：
# def patch_novel_cover_img_link():
#--------------------------------------     可复用的异步操作三部曲 #############################
# 1. fetchCoverImg
# 2. asyncContainer
# 3. startAsyncRequests
#--------------------------------------------------------------
#-------------------------------------- 当内容选择器错误时启用，使手动输入内容选择器
# def changeSelector(soup,url):
#-------------------------------------- 清除爬取的内容列表中的标签对象
# def clearTagInList(novel_chapter_content):
#----------------------- 用于下载小说的fetch方法 ，使用时替换掉异步操作三部曲中的1.fetchCoverImg,
#def fetchChapter(session,chapter):
#----------------------- 获取当前路径下的所有文件夹的路径，按照数字小到大排列
#def getDirList(path=novel_sources_dir):
#----------------------- 开始下载章节内容,getDirList()[208:]内的序号用于定位从第几本书开始下载
#def startDownloadChapters(novelFolders=getDirList()[208:],fetchChapter=fetchChapter):
###################################################################


novel_name_list_jsonfileName = 'novels.json'
newNovelsTableName = 'newNovels.json'
chapterContentSelector = '#content'
# allNewNovels储存每一个将属于novel_name_table，在获取所有小说目录页结束时用于生成newNovels.json，newNovels.json相比于旧的novels.json多出了【简介】等条目
allNewNovels = []
novel_sources_dir = os.getcwd()
os.environ['no_proxy'] = '*' 
userAgents = [ 
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/601.6.17 (KHTML, like Gecko) Version/9.1.1 Safari/601.6.17",
            "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
            "Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36",
            "Mozilla/5.0 (Linux; Android 7.0; SM-G892A Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/60.0.3112.107 Mobile Safari/537.36",
            "Mozilla/5.0 (Linux; Android 7.0; SM-G930VC Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.83 Mobile Safari/537.36",
            "Mozilla/5.0 (Linux; Android 6.0.1; SM-G935S Build/MMB29K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/55.0.2883.91 Mobile Safari/537.36",
            "Mozilla/5.0 (Linux; Android 6.0.1; SM-G920V Build/MMB29K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.36",
            "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1",
            "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/69.0.3497.105 Mobile/15E148 Safari/605.1",
            "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/13.2b11866 Mobile/16A366 Safari/605.1.15",
            "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1",
            "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1",
            "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A5370a Safari/604.1",
            "Mozilla/5.0 (Apple-iPhone7C2/1202.466; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A543 Safari/419.3",
            "Mozilla/5.0 (Windows Phone 10.0; Android 6.0.1; Microsoft; RM-1152) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Mobile Safari/537.36 Edge/15.15254",
            "Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; RM-1127_16056) AppleWebKit/537.36(KHTML, like Gecko) Chrome/42.0.2311.135 Mobile Safari/537.36 Edge/12.10536",
            "Mozilla/5.0 (Linux; Android 7.0; Pixel C Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/52.0.2743.98 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9"

]


# 从本地获取代理IP列表。
with open('proxyPool.json','r') as f:
    proxyPool = json.load(f)
root_url = 'https://www.37zw.net/xiaoshuodaquan/'
base_url = 'https://www.37zw.net'

# 进入包含所有小说的页面,生成【小说名】表，储存为json格式
def fetch_novel_name_table():
    while True:
        try:
            root_page = requests.get(root_url,proxies=random.choice(proxyPool),headers={'User-Agent':random.choice(userAgents)},timeout=5)
            if root_page.status_code != 200:
                print('连接网址失败,失败代码为: '+ root_page.status_code)
                continue
        except Exception as e:
            print('代理有问题：')
            continue
        break

    soup = BeautifulSoup(root_page.content,'lxml')
    genres = soup.select('.novellist')
    genre_flag = 1
    novel_name_list = []
    for each in genres:
        if genre_flag==1:
            novel_id = 100000
            novel_genre = '奇幻、玄幻'
        elif genre_flag==2:
            novel_id = 200000
            novel_genre = '武侠、仙侠、修真'
        elif genre_flag==3:
            novel_id = 300000
            novel_genre = '言情、都市'
        elif genre_flag==4:
            novel_id = 400000
            novel_genre = '历史、军事、穿越'
        elif genre_flag==5:
            novel_id = 500000
            novel_genre = '游戏、竞技、网游'
        elif genre_flag==6:
            novel_id = 600000
            novel_genre = '异灵、科幻'
        li_scope_soup = each.select('li')
        for each in li_scope_soup:
            novel_name_dict = {}
            novel_id = novel_id + 1
            novel_name_dict['novel_id'] = novel_id
            novel_name_dict['novel_name'] = each.contents[0].text.replace(' ','')
            novel_name_dict['novel_name_pinyin'] = lazy_pinyin(novel_name_dict['novel_name'])
            novel_name_dict['novel_author'] = each.contents[1].replace('/','').replace(' ','')
            novel_name_dict['novel_genre'] = novel_genre
            novel_name_dict['novel_category_url'] = base_url + each.contents[0].get('href')

            novel_name_list.append(novel_name_dict)
        genre_flag = genre_flag + 1
    with open(novel_name_list_jsonfileName,'w') as f:
        json.dump(novel_name_list,f)

# 从本地获取【小说名】表，并返回
def get_novel_name_table_from_local(novel_name_list_jsonfileName=novel_name_list_jsonfileName):
    with open(novel_name_list_jsonfileName,'r') as f:
        novel_name_table = json.load(f)
    return novel_name_table

# 从单个小说目录页面生成单个novel_category_table的json文件。
def get_novel_category_table(soup,novel_id,novel_category_url):
    # 以小说id为名创建文件夹，并进入该文件夹
    novel_sources_dir = os.getcwd()
    try:
        os.mkdir(novel_sources_dir+'/'+str(novel_id))
    except:
        pass

    #开始生成novel_category_table的表
    novel_category_table_file = novel_sources_dir + '/' + str(novel_id) + '/' + str(novel_id)+'10000'+'.json'
    novel_category_table = []
    volumes = soup.dl.select('dt')
    chapter_count = 10000
    for volume in volumes:
        for each_tag in volume.next_siblings:
            if(each_tag.name=='dt'):
                break
            if(each_tag.name):
                chapter_count += 1
                novel_chapter_id =int(str(novel_id)+str(chapter_count))
                novel_chapter_name = each_tag.text
                novel_chapter_volume = volume.text
                novel_chapter_link = novel_category_url + each_tag.a.attrs['href']
                temp = {
                    'novel_id':novel_id,
                    'novel_chapter_id':novel_chapter_id,
                    'novel_chapter_name':novel_chapter_name,
                    'novel_chapter_volume': novel_chapter_volume,
                    'novel_chapter_link': novel_chapter_link
                }
                novel_category_table.append(temp)
    with open(novel_category_table_file,'w') as f:
        json.dump(novel_category_table,f)



    

# 成功连接目录页面后进行‘抓取数据’操作
def fetch(session,novel_name,headers,proxies):
    try:
        with session.get(novel_name['novel_category_url'],timeout=5,headers=headers,proxies=proxies) as response:
            if response.status_code != 200:
                print("连接失败：{0}".format(novel_name['novel_category_url']))
                print("失败代码: " + response.status_code)
                #失败获取目录页面，则返回目录页面的str类型url，用于下一轮连接请求。
                return novel_name
            #成功获取目录页面，则开始抓取数据，并用抓取到的数据补充novel_name_table以及生成新的单个小说目录【表】
            pageContent = response.content
            soup = BeautifulSoup(pageContent,'lxml')
            # 以下抓取的条目将被补充到novel_name_table中
            novel_recent_update = soup.select('#info p:nth-child(4)')[0].text.replace('更新时间：','').strip()
            novel_synopsis = soup.select('#intro p:nth-child(1)')[0].text
            novel_cover_img_name = str(novel_name['novel_id']) + str(10000) + '.jpg'
            novel_cover_img_link = base_url + soup.select('#fmimg img')[0].attrs['src']


            novel_name['novel_recent_update'] = novel_recent_update
            novel_name['novel_synopsis'] = novel_synopsis
            novel_name['novel_cover_img_link'] = novel_cover_img_link
            novel_name['novel_cover_img_name'] = novel_cover_img_name

            allNewNovels.append(novel_name)
            # 单个小说目录表的抓取与生成
            get_novel_category_table(soup,novel_name['novel_id'],novel_name['novel_category_url'])
            print('id: %s  名目：%s  的目录表制作完成！'%(novel_name['novel_id'],novel_name['novel_name']))
            return 0
    except Exception as e:
        return novel_name

# 启动进入目录页面的【异步】连接操作
async def get_novel_category_tables(novel_name_table):
    connectionFailed_novel_name_obj = []
    with ThreadPoolExecutor(max_workers=20) as executor:
        with requests.Session() as session:
            loop = asyncio.get_event_loop()
            tasks = [
                loop.run_in_executor(
                    executor,
                    fetch,
                    *(session,novel_name,{'User-Agent':random.choice(userAgents)},random.choice(proxyPool))
                )
                for novel_name in novel_name_table
            ]
            for response in await asyncio.gather(*tasks):
                if response:
                    #获取失败的链接所属小说名表的对象
                    connectionFailed_novel_name_obj.append(response)
            return connectionFailed_novel_name_obj


# 获取单个小说目录【表】，异步连接的启动接口
# novel_category_table
def start_category_scrape(novel_name_table):
    loop = asyncio.get_event_loop()
    future = asyncio.ensure_future(get_novel_category_tables(novel_name_table))
    connectionFailed_novel_name_obj = loop.run_until_complete(future)
    if connectionFailed_novel_name_obj:
        start_category_scrape(connectionFailed_novel_name_obj)
    with open(newNovelsTableName,'w') as f:
        json.dump(allNewNovels,f)
    return 0

# 修补novel_name_table中novel_cover_img_link的细微错误：
def patch_novel_cover_img_link():
    nameTableOld = []
    nameTableNew = []
    with open(novel_name_list_jsonfileName,'r') as f:
        nameTableOld = json.load(f)
    for each in nameTableOld:
        each['novel_cover_img_link'] = each['novel_cover_img_link'].replace('netd','net/d')
        nameTableNew.append(each)
    with open(novel_name_list_jsonfileName,'w') as f:
        json.dump(nameTableNew,f)






# 用于下载小说封面的异步连接操作===========================================================================
#==========================可复用的异步操作三部曲===========================================
def fetchCoverImg(session,novel):
    if novel['novel_cover_img_link']:
        url = novel['novel_cover_img_link']
    else:
        return 0
    headers = {'User-Agent':random.choice(userAgents)}
    proxies = random.choice(proxyPool)
    imgPath = novel_sources_dir + '/' + str(novel['novel_id']) + '/' + novel['novel_cover_img_name']
    try:
        with session.get(url,headers=headers,proxies=proxies,timeout=5) as response:
            if response.status_code != 200:
                print("连接失败：{0}".format(url))
                print("失败代码: " + response.status_code)
                #失败获取目录页面，则返回目录页面的str类型url，用于下一轮连接请求。
                return novel
            # 如果发现网页不是图片则不下载
            if response.text.find('html')!=-1:
                print('pass')
                return 0

            pageContent = response.content
            with open(imgPath,'wb') as f:
                f.write(pageContent)
            print('id: %s 小说名：【 %s 】的封面图片下载成功！'%(novel['novel_id'],novel['novel_name']))
            return 0
    except Exception as e:
        print(e)
        return novel
# 异步操作的模板容器，只需替换掉fetchCoverImg方法
async def asyncContainer(dicts_list,fetchFun):
    connectionFailedObj = []
    with ThreadPoolExecutor(max_workers=20) as executor:
        with requests.Session() as session:
            loop = asyncio.get_event_loop()
            tasks = [
                loop.run_in_executor(
                    executor,
                    fetchFun,
                    *(session,dictObj)
                )
                for dictObj in dicts_list
            ]
            for response in await asyncio.gather(*tasks):
                if response:
                    #获取失败的链接所属的字典对象
                    connectionFailedObj.append(response)
            return connectionFailedObj
def startAsyncRequests(dicts_list,fetchFun):
    loop = asyncio.get_event_loop()
    future = asyncio.ensure_future(asyncContainer(dicts_list,fetchFun))
    connectionFailedObj = loop.run_until_complete(future)
    if connectionFailedObj:
        startAsyncRequests(connectionFailedObj)

#===========================================================================================

# 当内容选择器错误时启用，使手动输入内容选择器
def changeSelector(soup,url):
    global chapterContentSelector
    print('章节内容选择器有误！')
    chapterContentSelector = input('%s 的内容选择器需要修改：'%(url))
    try:
        novel_chapter_content = soup.select(chapterContentSelector)[0].contents
    except:
        changeSelector(soup)
    return novel_chapter_content
# 清除爬取的内容列表中的标签对象
def clearTagInList(novel_chapter_content):
    newList = []
    for each in novel_chapter_content:
        if each.name:
            continue
        newList.append(each)
    return newList

#-----------------------用于下载小说的fetch方法
def fetchChapter(session,chapter):
    try:
        novel_id = chapter['novel_id']
        novel_chapter_id = chapter['novel_chapter_id']
        novel_chapter_name = chapter['novel_chapter_name']
        novel_chapter_volume = chapter['novel_chapter_volume']
        url = chapter['novel_chapter_link']
    except Exception as e:
        print(e)
        return 0

    headers = {'User-Agent':random.choice(userAgents)}
    proxies = random.choice(proxyPool)
    chapterDir = novel_sources_dir + '/' + str(novel_id) + '/' + str(novel_chapter_id) + '.json'
    try:
        with session.get(url,headers=headers,proxies=proxies,timeout=5) as response:
            if response.status_code != 200:
                print("连接失败：{0}".format(url))
                print("失败代码: " + response.status_code)
                #失败获取目录页面，则返回目录页面的str类型url，用于下一轮连接请求。
                return chapter
            pageContent = response.content
            soup = BeautifulSoup(pageContent,'lxml')
            try:
                novel_chapter_content = soup.select(chapterContentSelector)[0].contents
            except:
                novel_chapter_content = changeSelector(soup,url)
            novel_chapter_content = clearTagInList(novel_chapter_content)
            
            data = [{
                'novel_id':novel_id,
                'novel_chapter_id':novel_chapter_id,
                'novel_chapter_name':novel_chapter_name,
                'novel_chapter_volume':novel_chapter_volume,
                'novel_chapter_content':novel_chapter_content
            }]
            try:
                with open(chapterDir,'w') as f:
                    json.dump(data,f)
            except Exception as e:
                print(e)

            print('成功下载novel_id: %s 章节id: %s 章节名： %s'%(novel_id,novel_chapter_id,novel_chapter_name))
            return 0
    except Exception as e:
        print(e)
        return chapter

#获取当前路径下的所有文件夹的路径，按照数字小到大排列
def getDirList(path=novel_sources_dir):
    dirList = []
    allDir = os.listdir(path)
    allDir.sort()
    for each in allDir:
        each = path + '/' + each
        if os.path.isdir(each):
            dirList.append(each)
    return dirList

# 开始下载章节内容,
def startDownloadChapters(novelFolders=getDirList(),fetchChapter=fetchChapter):
    flag = 0
    for each in novelFolders:
        flag += 1
        novelCategoryTableFile = each + '/' + os.path.basename(each) + '10000.json'
        with open(novelCategoryTableFile,'r') as f:
            novelCategoryTable = json.load(f)
        try:
            startAsyncRequests(novelCategoryTable,fetchChapter)
        except:
            startDownloadChapters(novelFolders = novelFolders[flag:])


# 用于进一步节选newNovels.json,生成新的newNovels.json(因为整体太多)
def limitSelection(limit=30):
    limit1 = int('1000'+str(limit))
    limit2 = int('2000'+str(limit))
    limit3 = int('3000'+str(limit))
    limit4 = int('4000'+str(limit))
    limit5 = int('5000'+str(limit))
    limit6 = int('6000'+str(limit))
    with open('newNovels.json','r') as f:
        test = json.load(f)
    newtest = []
    for each in test:
        if each['novel_id']>=600001:
            if each['novel_id']>limit6:
                continue
            newtest.append(each)
        elif each['novel_id']>=500001:
            if each['novel_id']>limit5:
                continue
            newtest.append(each)            
        elif each['novel_id']>=400001:
            if each['novel_id']>limit4:
                continue
            newtest.append(each)            
        elif each['novel_id']>=300001:
            if each['novel_id']>limit3:
                continue
            newtest.append(each)            
        elif each['novel_id']>=200001:
            if each['novel_id']>limit2:
                continue
            newtest.append(each)            
        elif each['novel_id']>=100001:
            if each['novel_id']>limit1:
                continue
            newtest.append(each)            
    with open('shortNovels.json','w') as f:
        json.dump(newtest,f)





# ===================== 测试 =================================

#1.所有小说名【表】json
# fetch_novel_name_table()
# 2.所有小说目录【表】json
# nameTable = get_novel_name_table_from_local('shortNovels.json')
# try:
#     start_category_scrape(nameTable)
# except Exception as e:
#     print(e)
#     with open(newNovelsTableName,'w') as f:
#         json.dump(allNewNovels,f)
# # 3.所有小说图片
# startAsyncRequests(nameTable,fetchCoverImg)
# 4.所有小说的章节内容
startDownloadChapters()

# 附加:用于限定每类别下载小说的数量
# limitSelection(30)



