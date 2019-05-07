import mysql.connector

# ===========================================函数目录====================================
# def databaseReconnect():
# def createTable(tableName,tableSetTupleList):
# def insertItem(tableName,varNames,values):
# def delItem(tableName,conditions):
# def updateItem(tableName,newValuePair,location):
# def selectItem(keys,tableName,condition=''):

                         



databaseName = 'novels'

# 用于在使用时处理connector下指定异常
connector = mysql.connector


mydb = mysql.connector.connect(
host="localhost",
user="testuser",
password="123456789"
)
mycursor = mydb.cursor()
# 检查数据库是否存在
def checkDatabaseExists(databaseName=databaseName):
    mycursor.execute("SHOW DATABASES")
    flag = 0
    for x in mycursor:
        if x[0]==databaseName:
            flag = 1
    return flag
#创建数据库
if checkDatabaseExists(databaseName)==0:
    mycursor.execute("CREATE DATABASE " + databaseName + " CHARACTER SET utf8 COLLATE utf8_unicode_ci")
#============================================ACCESS database======================================

def databaseReconnect():
    mydb.reconnect(attempts=10,delay=0)
    mycursor = mydb.cursor()
    mycursor.execute('use '+databaseName)
databaseReconnect()

#============================================create Table=======================================
# 用于创建table,参数tableSetTupleList格式为[('novel_id','MEDIUMINT PRIMARY KEY'),('novel_views_perday','INT'),('novel_synopsis','TEXT(65535)')]
def createTable(tableName,tableSetTupleList):
    tableSetString = ''
    for each in tableSetTupleList:
        tableSetString = tableSetString + str(each[0]) + ' ' + str(each[1]) + ','
    tableSetString = tableSetString[0:-1]
    sqlQuery =  'CREATE TABLE ' + tableName + ' (' + tableSetString + ')'
    mycursor.execute(sqlQuery)
    mydb.commit()
# =============================================增===============================================
# 为table增加条目，varNames为tuple类型，values为tuple类型
def insertItem(tableName,varNames,values):
    values = tuple(values)
    varString = ''
    dollarSignString = ''
    for each in varNames:
        varString = varString + each + ','
        dollarSignString = dollarSignString + '%s,'
    varString = varString[0:-1]
    dollarSignString = dollarSignString[0:-1]
    sql = "INSERT INTO " + tableName + ' (' + varString + ') VALUES (' + dollarSignString + ')'
    mycursor.execute(sql,values)
    mydb.commit()
# ===========================================Delete====================================================
# sql = "DELETE FROM " + tableName +" WHERE " +conditions
def delItem(tableName,conditions):
    sql = "DELETE FROM " + tableName +" WHERE " +conditions
    mycursor.execute(sql)
    mydb.commit()

# ===========================================UPDATE=========================================
# sql = "UPDATE "+tableName+" SET " + newValuePair + " WHERE " + location
def updateItem(tableName,newValuePair,location):
    sql = "UPDATE "+tableName+" SET " + newValuePair + " WHERE " + location
    mycursor.execute(sql)
    mydb.commit()
# ===========================================SELECT==========================================
def selectItem(keys,tableName,condition=''):
    sql = "SELECT " + keys +" FROM " +tableName + " " + condition
    mycursor.execute(sql)
    result = mycursor.fetchall()
    mydb.commit()
    return result


#===========================================测试用代码
#1.测试createTable()
#创建novel_name_table
# novelNameTableSettings =[
#     ('novel_id','MEDIUMINT PRIMARY KEY'),
#     ('novel_name','VARCHAR(255)'),
#     ('novel_name_pinyin','VARCHAR(255)'),
#     ('novel_author','VARCHAR(255)'),
#     ('novel_genre','VARCHAR(255)'),
#     ('novel_recent_update','DATE'),
#     ('novel_synopsis','TEXT(65535)'),
#     ('novel_views_perday','INT'),
#     ('novel_views_perweek','INT'),
#     ('novel_views_permonth','INT'),
#     ('novel_views_total','INT')
# ]
# createTable('novel_name_table',novelNameTableSettings)

#2.增
# varNames = ('novel_id','novel_name','novel_author')
# values = ('3','神墓','陈东')
# insertItem('novel_name_table',varNames,values)
        
#3.删
# delItem('novel_name_table','novel_id = 3')
#4.改
# updateItem('novel_name_table',"novel_name = '无双'","novel_id = 3")
#4.查
# testSelect = selectItem('*','novel_name_table')