#!/usr/bin/env python

"""
 * Data load utility
"""

import sys
import getopt
import http.client
import urllib
import json
from random import randint
from random import choice
from datetime import date
from time import mktime

def usage():
    # sample 
    print('dataload.py -u <baseurl> -p <port> -t <dataType> ')

############# Load users data    #############

def loadusers(baseurl, port):
    print("Loading Users in the database .........")
    # Server to connect to (1: url, 2: port number)
    conn = http.client.HTTPConnection(baseurl, port)
    # HTTP Headers
    headers = {"Content-type": "application/json"}
    # Open 'users.txt' for sample data
    f = open('users.txt','r')
    users = f.read().splitlines()
    for user in users:
        #print(user)
        fields = map(lambda s: s.strip(), user.split('|'))
        fieldslist = list(fields)

        jsond = {
            "id": fieldslist[0],
            "firstname": fieldslist[1],
            "lastname": fieldslist[2],
            "programYear": fieldslist[3],
            "program": fieldslist[4],
            "status": fieldslist[5],
            "completedCourses": fieldslist[6]
        }
        json_data = json.dumps(jsond)
        print(json_data)
        conn.request("POST", "/users/addUser", json_data, headers)
        response = conn.getresponse()
        data = response.read()
        # d = json.loads(data)
        conn.close()

    # Exit gracefully
    conn.close()

################################################

def main(argv):
    # Server Base URL and port
    baseurl = "localhost"
    port = 4000
    dataType = ""
    # Number of POSTs that will be made to the server

    try:
        opts, args = getopt.getopt(argv,"hu:p:t:",["url=","port=","datatype="])
    except getopt.GetoptError:
        usage()
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
             usage()
             sys.exit()
        elif opt in ("-u", "--url"):
             baseurl = str(arg)
        elif opt in ("-p", "--port"):
             port = int(arg)
        elif opt in ("-t", "--datatype"):
             dataType = (arg)
    if dataType == 'user':
        loadusers(baseurl=baseurl, port=port)


    print(" Data added at "+baseurl+":"+str(port))


if __name__ == "__main__":
     main(sys.argv[1:])
