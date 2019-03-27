import psycopg2
import wordFreq as wf



def getSortList(doc):
    return wf.getWords(doc)

docs = ['1', '2' ,'3', '4']

for doc in docs:
    fileLocation = './docs/' + doc + '.txt'
    sorted_list = wf.getWords(fileLocation)
    doc_title = open(fileLocation).readline()
    doc_name = doc + '.txt'
    print(sorted_list)

    try:
        connection = psycopg2.connect(user="postgres",
                                        password="postgres",
                                        host="127.0.0.1",
                                        port="5432",
                                        database="groupc_test")
        cursor = connection.cursor()
        postgres_insert_query = """ INSERT INTO documents (doc_name, doc_title) VALUES (%s,%s) RETURNING doc_id; """
        record_to_insert = (doc_name, doc_title)
        cursor.execute(postgres_insert_query, record_to_insert)
        doc_id = cursor.fetchone()[0]
        connection.commit()
        count = cursor.rowcount
        print (count, "Record inserted successfully into mobile table")
        for i in range(0,10):
            postgres_insert_query = """ INSERT INTO keywords (doc_id, keyword, keyword_rank) VALUES (%s,%s,%s); """
            rank = i+1
            record_to_insert = (doc_id, sorted_list[i], (i+1))
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