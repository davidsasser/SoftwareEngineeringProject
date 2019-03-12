import psycopg2
import wordFreq as wf

doc = input()
sorted_list = wf.getWords(doc)
doc_name = doc.split("/")[2]
print(sorted_list)

try:
   connection = psycopg2.connect(user="postgres",
                                  password="postgres",
                                  host="127.0.0.1",
                                  port="5432",
                                  database="groupc_test")
   cursor = connection.cursor()
   postgres_insert_query = """ INSERT INTO documents (keyword1, keyword2, keyword3, keyword4, keyword5, keyword6, keyword7, keyword8, keyword9, keyword10, doc_name) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"""
   record_to_insert = (sorted_list[0], sorted_list[0], sorted_list[1], sorted_list[2], sorted_list[3], sorted_list[4], sorted_list[5], sorted_list[6], sorted_list[8], sorted_list[9], doc_name)
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