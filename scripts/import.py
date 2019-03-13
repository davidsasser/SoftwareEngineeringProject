import psycopg2
import wordFreq as wf



def getSortList(doc):
    return wf.getWords(doc)

docs = ['1', '2' ,'3', '4', '5', '6','7', '8', '9', '10', '11']

for doc in docs:
    sorted_list = getSortList('./docs/' + doc + '.docx')
    doc_name = doc + '.docx'
    print(sorted_list)

    try:
        connection = psycopg2.connect(user="postgres",
                                        password="postgres",
                                        host="127.0.0.1",
                                        port="5432",
                                        database="groupc_test")
        cursor = connection.cursor()
        postgres_insert_query = """ INSERT INTO documents (doc_name) VALUES (%s) RETURNING doc_id; """
        record_to_insert = (doc_name,)
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