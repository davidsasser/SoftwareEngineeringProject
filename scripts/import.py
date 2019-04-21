import psycopg2
import wordFreq as wf
from os import listdir
from os.path import isfile, join
import datetime as dt

mypath = './docs/'

docs = [f for f in listdir(mypath) if isfile(join(mypath, f))]

for doc in docs:
    fileLocation = './docs/' + doc
    sorted_list, sorted_num = wf.getWords(fileLocation)
    doc_title = doc.split('.')[0]
    doc_name = doc
    print(sorted_list)

    try:
        connection = psycopg2.connect(user="postgres",
                                        password="postgres",
                                        host="127.0.0.1",
                                        port="5432",
                                        database="groupc_test")
        cursor = connection.cursor()
        postgres_insert_query = """ INSERT INTO documents (doc_name, doc_title, added_on) VALUES (%s,%s,%s) RETURNING doc_id; """
        now = dt.datetime.utcnow().replace(microsecond=0)
        record_to_insert = (doc_name, doc_title, now)
        cursor.execute(postgres_insert_query, record_to_insert)
        doc_id = cursor.fetchone()[0]
        connection.commit()
        count = cursor.rowcount
        print (count, "Record inserted successfully into mobile table")
        for i in range(0,10):
            postgres_insert_query = """ INSERT INTO keywords (doc_id, keyword, keyword_rank, frequency) VALUES (%s,%s,%s,%s); """
            rank = i+1
            record_to_insert = (doc_id, sorted_list[i], (i+1), sorted_num[i])
            cursor.execute(postgres_insert_query, record_to_insert)
            connection.commit()
            count = cursor.rowcount
            print (count, "Record inserted successfully into mobile table")
    except (Exception, psycopg2.Error) as error :
        if(connection):
            print("Failed to insert record into mobile table", error)
    finally:
        #closing database connection.
        if(connection):
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")