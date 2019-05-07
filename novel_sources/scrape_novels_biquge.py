import requests
from bs4 import BeautifulSoup
import random
import json
import asyncio
from concurrent.futures import ThreadPoolExecutor
import json
import os
from bs4 import BeautifulSoup
from pypinyin import lazy_pinyin
from tools import getDirList

root_dir = os.getcwd()
baseUrl = 'https://www.biquge.info'
novels_libBaseUrl = 'https://www.biquge.info/paihangbang_allvisit/'
novels_libUrls = []
novel_infos = []
originalNovelInfosJson = 'originalNovelInfos.json'
novelInfosJson = 'novelInfos.json'
chapterContentSelector = '#content'

for i in range(2038):
    novels_libUrl = novels_libBaseUrl + str(i+1) + '.html'
    novels_libUrls.append(novels_libUrl)
# 从本地获取代理IP列表。
with open('proxyPool.json','r') as f:
    proxyPool = json.load(f)

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


def fetchOriginalNovelInfos(session,novel):
    url = novel
    headers = {'User-Agent':random.choice(userAgents)}
    proxies = random.choice(proxyPool)
    try:
        with session.get(url,headers=headers,proxies=proxies,timeout=5) as response:
            if response.status_code != 200:
                print("连接失败：{0}".format(url))
                print("失败代码: " + response.status_code)
                #失败获取目录页面，则返回目录页面的str类型url，用于下一轮连接请求。
                return novel

            pageContent = response.content
            soup = BeautifulSoup(pageContent,'lxml')
            singleNovelList = soup.select('.novelslistss li')
            for each in singleNovelList:
                items = each.select('span')
                novel_genre = items[0].get_text().strip('[]')
                novel_name = items[1].get_text()
                novel_link = items[1].select_one('a').get('href')
                novel_author = items[3].get_text()
                novel_lastUpdate = items[4].get_text()
                novel_status = items[5].get_text()
                novel_infos.append({
                    'novel_name':novel_name,
                    'novel_author':novel_author,
                    'novel_genre':novel_genre,
                    'novel_link':novel_link,
                    'novel_lastUpdate':novel_lastUpdate,
                    'novel_status':novel_status
                })
            print('%s collecting complete' % (url))
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



# ===================================================获取【小说名】表
# 获取original  novel_infos
def yieldOriginalNovelInfosJson():
    startAsyncRequests(novels_libUrls,fetchOriginalNovelInfos)
    with open(originalNovelInfosJson,'w') as f:
        json.dump(novel_infos,f)

# 二次加工originalNovelInfosJson，添加id等
def processOriginalNovelInfosJson():
    with open(originalNovelInfosJson,'r') as f:
        oldNovels = json.load(f)
    count = 0
    newNovels = []
    for each in oldNovels:
        count += 1
        each['novel_id'] = count
        each['novel_name_pinyin'] = '.'.join(lazy_pinyin(each['novel_name']))
        if each['novel_genre'] == '玄幻小说':
            each['novel_genre'] = 1
        elif each['novel_genre'] == '修真小说':
            each['novel_genre'] = 2
        elif each['novel_genre'] == '都市小说':
            each['novel_genre'] = 3
        elif each['novel_genre'] == '穿越小说':
            each['novel_genre'] = 4
        elif each['novel_genre'] == '网游小说':
            each['novel_genre'] = 5
        elif each['novel_genre'] == '科幻小说':
            each['novel_genre'] = 6
        if each['novel_status'] == '连载':
            each['novel_status'] = 0
        elif each['novel_status'] == '完成':
            each['novel_status'] = 1
        newNovels.append(each)
    with open(originalNovelInfosJson,'w') as f:
        json.dump(newNovels,f)


# ==========================================获取目录页面内的信息====================
newNovels = []
def fetchCategory(session,novel):
    url = novel['novel_link']
    headers = {'User-Agent':random.choice(userAgents)}
    proxies = random.choice(proxyPool)
    try:
        with session.get(url,headers=headers,proxies=proxies,timeout=5) as response:
            if response.status_code != 200:
                print("连接失败：{0}".format(url))
                print("失败代码: " + response.status_code)
                #失败获取目录页面，则返回目录页面的str类型url，用于下一轮连接请求。
                return novel

            pageContent = response.content
            soup = BeautifulSoup(pageContent,'lxml')

            # -----------------------------小说目录表json
            chapterSoup = soup.select('dl dd')
            novel_chapter_id = 0
            categoryData = []
            for each in chapterSoup:
                novel_chapter_id += 1
                novel_chapter_name = each.get_text()
                novel_chapter_link = url + each.a.get('href')
                novel_id = novel['novel_id']
                categoryData.append({
                    'novel_id':novel_id,
                    'novel_chapter_id':novel_chapter_id,
                    'novel_chapter_name':novel_chapter_name,
                    'novel_chapter_link':novel_chapter_link
                })
            dirName = root_dir + '/' +str(novel['novel_id'])
            jsonFileName = dirName + '/' + str(novel['novel_id']) + '.json'
            try:
                os.mkdir(dirName)
            except:
                pass
            with open(jsonFileName,'w') as f:
                json.dump(categoryData,f)
            
            novel_synopsis = soup.select_one('#intro p').get_text()
            novel_cover_img_link = soup.select_one('#fmimg img').get('src')
            novel['novel_synopsis'] = novel_synopsis
            novel['novel_cover_img_link'] = novel_cover_img_link
            newNovels.append(novel)
            print('novelId:%s collecting complete' % (novel['novel_id']))
            return 0
    except Exception as e:
        print(e)
        return novel


def getCategoryData():
    startAsyncRequests(testNovels,fetchCategory)
    with open(novelInfosJson,'w') as f:
        json.dump(newNovels,f)


# ===========================================下载封面图到本地
def fetchCoverImg(session,novel):
    if novel['novel_cover_img_link']:
        url = novel['novel_cover_img_link']
    else:
        return 0
    headers = {'User-Agent':random.choice(userAgents)}
    proxies = random.choice(proxyPool)
    imgPath = root_dir + '/' + str(novel['novel_id']) + '/' +  str(novel['novel_id']) + '.jpg'
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
def getCoverImg():
    startAsyncRequests(testNovels,fetchCoverImg)


# =====================================开始下载章节内容部分=====================

#-----------------------用于下载小说的fetch方法
def fetchChapter(session,chapter):
    try:
        novel_id = chapter['novel_id']
        novel_chapter_id = chapter['novel_chapter_id']
        novel_chapter_name = chapter['novel_chapter_name']
        url = chapter['novel_chapter_link']
    except Exception as e:
        print(e)
        return 0

    headers = {'User-Agent':random.choice(userAgents)}
    proxies = random.choice(proxyPool)
    chapterDir = root_dir + '/' + str(novel_id) + '/' + 'ch' + str(novel_chapter_id) + '.json'
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
                novel_chapter_content = soup.select(chapterContentSelector)[0].get_text()
            except:
                return 0
            
            data = [{
                'novel_id':novel_id,
                'novel_chapter_id':novel_chapter_id,
                'novel_chapter_name':novel_chapter_name,
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



# 开始下载章节内容,
def startDownloadChapters(novelFolders=getDirList()[5:],fetchChapter=fetchChapter):
    flag = 0
    for each in novelFolders:
        flag += 1
        novelCategoryTableFile = each + '/' + os.path.basename(each) + '.json'
        with open(novelCategoryTableFile,'r') as f:
            novelCategoryTable = json.load(f)
        try:
            startAsyncRequests(novelCategoryTable,fetchChapter)
        except:
            startDownloadChapters(novelFolders = novelFolders[flag:])


# 测试用代码
# with open(originalNovelInfosJson,'r') as f:
#     oldNovels = json.load(f)
# testNovels = oldNovels[0:300]

with open(novelInfosJson,'r') as f:
    testNovels = json.load(f)


# yieldOriginalNovelInfosJson()
# processOriginalNovelInfosJson()
# getCategoryData()   
# getCoverImg()
startDownloadChapters()
