import pymongo
import uuid
from flask import Flask,render_template,request,make_response,jsonify,redirect,url_for
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.secret_key="chatapp"
myclient = pymongo.MongoClient("mongodb+srv://dsmanohar:dsmanohar@cluster0-fehln.mongodb.net/usersdatabase?retryWrites=true&w=majority")
mydb = myclient["usersdatabase"]
mycol=mydb["accounts"]
frndscol=mydb["friendslist"]
convocol=mydb["conversation"]
postcol=mydb["posts"]
@app.route('/home',methods=['POST','GET'])
def helloworld():
    if request.method=='GET':
        return  render_template('app.html')
    if request.method == 'POST':
        obj = request.get_json()
        if(obj["status"]=="ok"):
            k=frndscol.find_one({"userid":obj["userid"]})
            k=k["friendslist"]
            ids,frnds = list(zip(*k))[0],list(zip(*k))[1]
            returnlist=[]
            for index,value in enumerate(ids):
                h=convocol.find_one({"newid":value})
                p=h["conversation"]
                if len(p)>0:
                    k=p[0][0].split(" ", 1)
                    returnlist.append({"userid":frnds[index],"msg":k[1]})
                else:
                    returnlist.append({"userid":frnds[index],"msg":""})
            return make_response(jsonify({"data": returnlist}), 200)
        else:
            k = frndscol.find_one({"userid": obj["userid"]})
            k = k["friendslist"]
            ids, frnds = list(zip(*k))[0], list(zip(*k))[1]
            for index,value in enumerate(frnds):
                if(obj["frndid"]==value):
                    query={"newid":ids[index]}
                    l=convocol.find_one(query)
                    chat=l["conversation"]
                    if(len(chat)>0):
                        return make_response(jsonify({"data": chat}), 200)
                    else:
                        return make_response(jsonify({"data": "empty"}), 200)
            return make_response(jsonify({"data": "wrong"}), 200)
@app.route('/home/chat',methods=['POST','GET'])
def chatting():
    if request.method=="POST":
        obj=request.get_json()
        msg=[obj["userid"]+" "+obj["msg"]]
        k = frndscol.find_one({"userid": obj["userid"]})
        k = k["friendslist"]
        ids, frnds = list(zip(*k))[0], list(zip(*k))[1]
        for index, value in enumerate(frnds):
            if (obj["frndid"] == value):
                query = {"newid": ids[index]}
                l = convocol.find_one(query)
                chat = list(l["conversation"])
                if (chat):
                    chat.insert(len(chat),msg)
                    print(chat)
                    newvalues = {"$set": {"conversation": chat}}
                    convocol.update_one(query, newvalues)
                    return make_response(jsonify({"data": "ok"}), 200)
                else:
                    newchat=[]
                    newchat.append(msg)
                    print(newchat)
                    newvalues = {"$set": {"conversation": newchat}}
                    convocol.update_one(query, newvalues)
                    return make_response(jsonify({"data": "ok"}), 200)
        return make_response(jsonify({"data": "nofrndid"}), 200)
@app.route('/',methods=['POST','GET'])
def homepath():
    if(request.method=='GET'):
        return render_template('index.html')
@app.route('/post',methods=['POST','GET'])
def posts():
    if (request.method == 'POST'):
        obj = request.get_json()
        print(obj)
        if(obj["status"]=="posts"):

            data={"userid":obj["userid"],"post":obj["post"]}
            postcol.insert_one(data)
            return make_response(jsonify({"status": "ok"}), 200)
        else:
            retunrlist=[]
            posts=list(postcol.find())
            for i in posts:
                newblock=[i["userid"],i["post"]]
                retunrlist.append(newblock)
            return make_response(jsonify({"data":retunrlist}), 200)


@app.route('/find',methods=['POST','GET'])
def findpeople():
    stak=[]
    if(request.method=='GET'):
        return render_template('find.html')
    if (request.method == 'POST'):
        obj = request.get_json()
        if(obj["status"]=="ok"):
            y = mycol.find()
            k = list(y)
            for i in k:
                stak.append(i['userid'])
            return make_response(jsonify({"data":stak}),200)
        else:
            userid=obj["userid"]
            frndid=obj["frndid"]
            query={"userid":userid}
            realtion=frndscol.find_one(query)
            if(realtion["friendslist"]):
                k=realtion["friendslist"]
                u=list(zip(*k))[1]
                if frndid in list(u):
                    return make_response(jsonify({"status":"already frnds"}),200)
                else:
                    diffid=uuid.uuid4()
                    newblock=[diffid,frndid]
                    convocol.insert_one({"newid":diffid,"conversation":[]})
                    l=realtion["friendslist"]
                    l.insert(0,newblock)
                    frndlistquerry={"userid":userid}
                    newvalue={"$set":{"friendslist":l}}
                    frndscol.update_one(frndlistquerry,newvalue)
                    x=frndscol.find_one({"userid":frndid})
                    newblock=[diffid,userid]
                    p=[]
                    if(x["friendslist"]):
                        p=x["friendslist"]
                    p.insert(0, newblock)
                    frndlistquerry = {"userid": frndid}
                    newvalue = {"$set": {"friendslist": p}}
                    frndscol.update_one(frndlistquerry, newvalue)

            else:
                newlist=[]
                diffid = uuid.uuid4()
                newblock = [diffid, frndid]
                convocol.insert_one({"newid": diffid, "conversation": []})
                newlist.insert(0, newblock)
                frndlistquerry = {"userid": userid}
                newvalue = {"$set": {"friendslist": newlist}}
                frndscol.update_one(frndlistquerry, newvalue)
                x = frndscol.find_one({"userid": frndid})
                o=[]
                if(x["friendslist"]):
                    o=x["friendslist"]
                newblock = [diffid, userid]
                o.insert(0, newblock)
                frndlistquerry = {"userid": frndid}
                newvalue = {"$set": {"friendslist": o}}
                frndscol.update_one(frndlistquerry, newvalue)
            return make_response(jsonify({"data":"ok"}),200)


@app.route('/login',methods=['POST','GET'])
def login():
    if (request.method == 'GET'):
        return render_template('login.html')
    if (request.method == 'POST'):
        obj=request.get_json()
        querry={"userid": obj["userid"]}

        x = mycol.find_one(querry)
        if(x):
            if(x["password"]==obj["password"]):
                return (make_response(jsonify({"status": "ok"}), 200))
            else:
                return (make_response(jsonify({"status": "no"}), 200))

        else:
            return (make_response(jsonify({"status": "no"}), 200))

@app.route('/signup',methods=['POST','GET'])
def signup():
    if (request.method == 'GET'):
        return render_template('signup.html')
    if (request.method == 'POST'):
        obj=request.get_json()
        querry = {"userid": obj["userid"]}
        x = mycol.find_one(querry)
        if(x):
            return(make_response(jsonify({"status":"exists"}), 200))
        else:
            f=mycol.insert_one(obj)
            frndscol.insert_one({"userid":obj["userid"],"friendslist":[]})
            return (make_response(jsonify({"status":"ok"}), 200))
if __name__== "__main__":
    app.run(debug=True)
