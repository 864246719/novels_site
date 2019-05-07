import json
import os
import base64
import mysqlConnector as mysql
from tools import getDirList, getFileList

NOVEL_NAME_JSON = 'novelInfos.json'
# 创建novel_name_table 并从本地的NOVEL_NAME_JSON中取值所有小说名插入novel_name_table表中
def insertIntoNovels():
    novelNameTableSettings = [
        ('novel_id', 'MEDIUMINT PRIMARY KEY'),
        ('novel_name', 'VARCHAR(255)'),
        ('novel_name_pinyin', 'VARCHAR(255)'),
        ('novel_author', 'VARCHAR(255)'),
        ('novel_genre', 'MEDIUMINT'),
        ('novel_lastUpdate', 'DATE'),
        ('novel_synopsis', 'TEXT(65535)'),
        ('novel_views_perday', 'INT'),
        ('novel_views_perweek', 'INT'),
        ('novel_views_permonth', 'INT'),
        ('novel_views_total', 'INT')
    ]
    mysql.createTable('novel_name_table', novelNameTableSettings)

    with open(NOVEL_NAME_JSON, 'r') as f:
        novels = json.load(f)
    tableName = 'novel_name_table'
    for each in novels:
        varNames = [
            'novel_id',
            'novel_name',
            'novel_name_pinyin',
            'novel_author',
            'novel_genre',
            'novel_lastUpdate',
            'novel_synopsis',
            'novel_views_perday',
            'novel_views_perweek',
            'novel_views_permonth',
            'novel_views_total'
        ]
        values = (
            each['novel_id'],
            each['novel_name'],
            each['novel_name_pinyin'],
            each['novel_author'],
            each['novel_genre'],
            each['novel_lastUpdate'],
            each['novel_synopsis'],
            0,
            0,
            0,
            0
        )
        mysql.insertItem(tableName, varNames, values)
        # print('成功插入第 %s 条小说名'%(each['novel_id']))


# 创建cover_imgs表，并插入经过base64.b64encode()之后的图片数据，取出时需要base64.b64decode()
def insertIntoCovers():
    tableName = 'cover_imgs'
    coverImgTableSettings = [
        ('novel_id', 'MEDIUMINT'),
        ('img_content', 'MEDIUMBLOB')
    ]

    mysql.createTable(tableName, coverImgTableSettings)
    dirList = getDirList()

    for each in dirList:
        basename = os.path.basename(each)
        imgFile = each + '/' + basename + '.jpg'
        try:
            with open(imgFile, 'rb') as f:
                img = f.read()
        except FileNotFoundError as e:
            print(e)
            continue
        encodeString = base64.b64encode(img)
        varNames = [
            'novel_id',
            'img_content'
        ]
        values = [
            basename,
            encodeString
        ]
        mysql.insertItem(tableName, varNames, values)
        # print('成功插入novel_id: %s 的图片' % (basename))

# 为每本小说创建一张目录表，
def insertIntoCatalog():
    novelCategoryTableSettings = [
        ('novel_id', 'MEDIUMINT'),
        ('novel_chapter_id', 'BIGINT'),
        ('novel_chapter_name', 'VARCHAR(255)')
    ]
    dirList = getDirList()
    for each in dirList:
        basename = os.path.basename(each)
        fileName = each + '/' + basename + '.json'
        tableName = 'catalog_' + basename
        varNames = [
            'novel_id',
            'novel_chapter_id',
            'novel_chapter_name'
        ]

        try:
            with open(fileName, 'r') as f:
                category = json.load(f)
        except FileNotFoundError as e:
            print(e)
            continue
        mysql.createTable(tableName, novelCategoryTableSettings)

        for each in category:
            values = [
                each['novel_id'],
                each['novel_chapter_id'],
                each['novel_chapter_name']
            ]
            try:
                mysql.insertItem(tableName, varNames, values)
                # print('成功创建novel_id: %s 的目录表'%(each['novel_id']))
            except (mysql.connector.errors.ProgrammingError,mysql.connector.errors.OperationalError) as e:
                print(e)
                mysql.databaseReconnect()
                try:
                    mysql.insertItem(tableName, varNames, values)
                except Exception as e:
                    print(e)
            except Exception as e:
                print(e)

# 创建每小说章节内容表，并插入小说内容
def insertIntoChapters():
    allDirList = getDirList()
    chapterTableSettings = [
        ('novel_id','MEDIUMINT'),
        ('novel_chapter_id','BIGINT  PRIMARY KEY'),
        ('novel_chapter_name','VARCHAR(255)'),
        ('novel_chapter_content','TEXT(65535)')
    ]
    varNames = [
        'novel_id',
        'novel_chapter_id',
        'novel_chapter_name',
        'novel_chapter_content'
    ]
    for each in allDirList:
        baseName = os.path.basename(each)
        allFileList = getFileList(each)
        tableName = 'chapters_' + baseName
        mysql.createTable(tableName,chapterTableSettings)
        for chapterFile in allFileList:
            if chapterFile.find('/ch') == -1:
                continue
            try:
                with open(chapterFile,'r') as f:
                    chapter = json.load(f)
            except Exception as e:
                print(e)
                print('章节内容json打开错误，文件名为： %s '%(chapterFile))
                continue
            
            for each in chapter:
                values = [
                    each['novel_id'],
                    each['novel_chapter_id'],
                    each['novel_chapter_name'],
                    each['novel_chapter_content']
                ]
                try:
                    mysql.insertItem(tableName,varNames,values)
                    # print('成功插入novel_id: %s ,novel_chapter_id: %s ,novel_chapter_name: %s'%(each['novel_id'],each['novel_chapter_id'],each['novel_chapter_name']))
                except (mysql.connector.errors.ProgrammingError,mysql.connector.errors.OperationalError) as e:
                    print(e)
                    mysql.databaseReconnect()
                    try:
                        mysql.insertItem(tableName,varNames,values)
                    except Exception as e:
                        print(e)
                        continue
                except Exception as e:
                    print(e)
                    continue
                        
                    



#insertIntoNovels()
#insertIntoCovers()
#insertIntoCatalog()
insertIntoChapters()


mysql.mycursor.close()
mysql.mydb.close()
