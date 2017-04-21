import urllib2
import time
import json
import os

from random import Random

s_cookie="JSESSIONID=33F4083FD6BE343B92578584EEC11B09; __mta=151303430.1489221781838.1492490319875.1492503454888.186; _ga=GA1.2.1101971675.1478676957; _act=C0grhj5e0al9rKSjU1q0fsz8yzHubD99DAMjreLq1_X4rv-K7T31j1WrzFd-RdLoFtxwKgO2-HzQgC03JiV0egrpnThkWXatiuT5V-KQehs"

def random_str(randomlength=6):
    str = ''
#    chars = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789'
    chars = 'abcdefghijklmnopqrstuvwxyz0123456789'

    length = len(chars) - 1
    random = Random()
    for i in range(randomlength):
        str+=chars[random.randint(0, length)]
    return str

def grab(uid):
    url="http://www.iquanwai.com/homework/load/" + uid
    errorStr = "221}"
    req=urllib2.Request(url)
    response=urllib2.urlopen(req)
    the_page=response.read()
    if the_page.find(errorStr) > -1:
        print uid
    else:
        savedFile = open(uid, 'w+')
        print >> savedFile,the_page

    #  url = "http://www.iquanwai.com/fragment/subject/show?problemId=" + problemId + "&submitId=" + submitId;

def pullpage(subId):
    sid=str(subId)
#    url="http://www.iquanwai.com/pc/fragment/application/mine/967/" + sid;
    url="http://www.iquanwai.com/pc/fragment/application/list/other/" + sid
    req=urllib2.Request(url)
    req.add_header('Cookie','_ga=GA1.2.108208881.1488618536; _qt=6ovqb5vmjiuq3mxr6zdp5ubl7rkiauiox3b6rx0go59ka7guu5fzdor60xbq0p79jq4b8ppwt8ajkocavh8ztrmqvmke827ilce; Hm_lvt_64c8a6d40ec075c726072cd243d008a3=1489753427,1489815307; Hm_lpvt_64c8a6d40ec075c726072cd243d008a3=1490096995; JSESSIONID=CECE0760DFE30447EEB8C7645C3913AF')
    res=urllib2.urlopen(req)
    the_page=res.read()
    name=sid+".txt"
    savedFile = open(name, 'w+')
    print >> savedFile,the_page

def pullAnswers(subId):
    sid=str(subId)
#    url="http://www.iquanwai.com/pc/fragment/application/mine/967/" + sid;
    url="http://www.iquanwai.com/pc/fragment/application/list/other/" + sid

    name=sid+".txt"
    savedFile = open(name, 'a')

    for pageId in range(1,6):
        pageUrl = url + "?page=" + str(pageId)
        print pageUrl
        req=urllib2.Request(pageUrl)
        req.add_header('Cookie','_ga=GA1.2.108208881.1488618536; JSESSIONID=9B2E5847BD90143FD4C82A547E35B738; _qt=jakts6l6ivc4cabcln1vpya31trib1y9tguxp8xg2nseu25ubjhh5f8zdm8q48ubw0kno796wy4o3scmks1kxg3pqgcnz2oixf9; Hm_lvt_64c8a6d40ec075c726072cd243d008a3=1489753427,1489815307; Hm_lpvt_64c8a6d40ec075c726072cd243d008a3=1490889051')
        res=urllib2.urlopen(req)
        the_page=res.read()
        savedFile.write(the_page)
        time.sleep(0.5)

    savedFile.close()

def pullDetailedAnswer(subId):
    print subId
    sid=str(subId)
    url="http://www.iquanwai.com/pc/fragment/application/show/" + sid
    req=urllib2.Request(url)
    req.add_header('Cookie','_ga=GA1.2.108208881.1488618536; JSESSIONID=9B2E5847BD90143FD4C82A547E35B738; _qt=jakts6l6ivc4cabcln1vpya31trib1y9tguxp8xg2nseu25ubjhh5f8zdm8q48ubw0kno796wy4o3scmks1kxg3pqgcnz2oixf9; Hm_lvt_64c8a6d40ec075c726072cd243d008a3=1489753427,1489815307; Hm_lpvt_64c8a6d40ec075c726072cd243d008a3=1490889051')
    res=urllib2.urlopen(req)
    the_page=res.read()

    jo = json.loads(the_page)
    if jo['code'] == 200 :
        name=sid+".txt"
        savedFile = open(name, 'w+')
        print >> savedFile,the_page
        savedFile.close()

#-----------------------

def loadUnchoosen():
    url="http://www.iquanwai.com/rise/problem/list/unchoose"
    req=urllib2.Request(url)
    req.add_header('Cookie',s_cookie);
    res=urllib2.urlopen(req)
    payload=res.read()

    jsPayload = json.loads(payload)
    if jsPayload['code'] == 200 :
        fileName='unchoosen.txt'
        savedFile=open(fileName,'w+')
        print >> savedFile,payload
        savedFile.close()


def loadKnowledge(knowledgeId):
    sid=str(knowledgeId)
    url="http://www.iquanwai.com/customer/rise/knowledge/" + sid
    req=urllib2.Request(url)
    req.add_header('Cookie',s_cookie);
    res=urllib2.urlopen(req)
    payload=res.read()

    jsPayload = json.loads(payload)
    if jsPayload['code'] == 200 :
        fileName='knowledge_' + sid + ".txt"
        savedFile=open(fileName,'w+')
        print >> savedFile,payload
        savedFile.close()

def loadProblem(problemId):
    sid=str(problemId)
    url="http://www.iquanwai.com/rise/problem/get/" + sid
    req=urllib2.Request(url)
    req.add_header('Cookie',s_cookie);
    res=urllib2.urlopen(req)
    payload=res.read()

    jsPayload = json.loads(payload)
    if jsPayload['code'] == 200 :
        fileName='problem_' + sid + ".txt"
        savedFile=open(fileName,'w+')
        print >> savedFile,payload
        savedFile.close()

def loadCurrentPlan(pageNum):
    sid=str(pageNum)
    url="http://www.iquanwai.com/rise/plan/history/load/" + sid
    req=urllib2.Request(url)
    req.add_header('Cookie',s_cookie);
    res=urllib2.urlopen(req)
    payload=res.read()

    jsPayload = json.loads(payload)
    if jsPayload['code'] == 200 :
        fileName='history_plan_' + sid + ".txt"
        savedFile=open(fileName,'w+')
        print >> savedFile,payload
        savedFile.close()


# Knowledge point in each practice unit. i.e 51613
def loadPracticeKnowledge(practicePlanId):
    sid=str(practicePlanId)
    url="http://www.iquanwai.com/rise/practice/knowledge/start/" + sid
    req=urllib2.Request(url)
    req.add_header('Cookie',s_cookie);
    res=urllib2.urlopen(req)
    payload=res.read()

    jsPayload = json.loads(payload)
    if jsPayload['code'] == 200 :
        fileName='practice_Knowledge_' + sid + ".txt"
        savedFile=open(fileName,'w+')
        print >> savedFile,payload
        savedFile.close()

# understand practice in each practice unit.i.e 51613
def loadPracticeUnderstand(practicePlanId):
    sid=str(practicePlanId)
    url="http://www.iquanwai.com/rise/practice/warmup/analysis/" + sid
    req=urllib2.Request(url)
    req.add_header('Cookie',s_cookie);
    res=urllib2.urlopen(req)
    payload=res.read()

    jsPayload = json.loads(payload)
    if jsPayload['code'] == 200 :
        fileName='practice_Understand_' + sid + ".txt"
        savedFile=open(fileName,'w+')
        print >> savedFile,payload
        savedFile.close()

# applied practice in each practice unit i.e 
def loadPracticeAppliedInfo(practicePlanId):
    sid=str(practicePlanId)
    url="http://www.iquanwai.com/rise/practice/application/start/" + sid
    req=urllib2.Request(url)
    req.add_header('Cookie',s_cookie);
    res=urllib2.urlopen(req)
    payload=res.read()

    jsPayload = json.loads(payload)
    if jsPayload['code'] == 200 :
        fileName='practice_applied_info_' + sid + ".txt"
        savedFile=open(fileName,'w+')
        print >> savedFile,payload
        savedFile.close()


def loadPracticeAppliedAnswer(practicePlanId, pageNum):
    sid=str(practicePlanId)
    snum=str(pageNum)
    url="http://www.iquanwai.com/rise/practice/application/list/other/" + sid + "?page=" + snum

    req=urllib2.Request(url)
    req.add_header('Cookie',s_cookie);
    res=urllib2.urlopen(req)
    payload=res.read()

    jsPayload = json.loads(payload)
    if jsPayload['code'] == 200 :
        fileName='practice_applied_answer_'+ sid + "_" + snum + ".txt"
        savedFile=open(fileName,'w+')
        print >> savedFile,payload
        savedFile.close()

        if jsPayload['msg']['end'] == False :
            nextPage = pageNum + 1
            loadPracticeAppliedAnswer(practicePlanId, nextPage)


def loadAllAppliedPractices():
    for i in range(1,250):
        loadPracticeAppliedInfo(i)
        loadPracticeAppliedAnswer(i,1)
        time.sleep(1)
        print str(i)

def rename():
    path = '/Users/fengka/Sites/rise/data/files';
    filelist=os.listdir(path);
    for files in filelist:
        olddir=os.path.join(path,files);
        filename=os.path.splitext(files)[0]; 
        filetype=os.path.splitext(files)[1];
        print filename;
        print filetype;
        newdir=os.path.join(path,filename+".json");
        print newdir;
        os.rename(olddir,newdir);

def loadJson(filePath):
    dashboardHandler = open(filePath,'r');
    dashboardContent = dashboardHandler.read();
    dashboardJson = json.loads(dashboardContent);
    dashboardHandler.close();
    return dashboardJson;

def extractAndMapIds():
 #   dashboardFile='/Users/fengka/Sites/rise/data/unchoosen.json';
 #   dashboardJson = loadJson(dashboardFile);
 #   print dashboardJson['msg']['name'];

    #{'49':[101,102]}
    dic = {};
    path = '/Users/fengka/Sites/rise/data/practices/infos';
    filelist=os.listdir(path);
    for files in filelist:
        fileDir=os.path.join(path,files);

        fileJson = loadJson(fileDir);
        klId = fileJson['msg']['knowledgeId'];
        pracId = fileJson['msg']['id'];
        
        if dic.has_key(klId):
            dic[klId].append(pracId);
        else:
            dic[klId] = [pracId];

    dicJs = json.dumps(dic);
    dicFile = open('dicmap.json','w');
    dicFile.write(dicJs);
    dicFile.close();
            





#loadUnchoosen()
#loadCurrentPlan(2)
#loadProblem(11)
#loadPracticeKnowledge(51608)
#loadPracticeUnderstand(51613)
#loadPracticeAppliedInfo(117)
#loadPracticeAppliedAnswer(117,1)
#rename();

#loadAllAppliedPractices()

extractAndMapIds();


