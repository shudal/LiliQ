# 将pimg表里的
#   1.postid=NULL
#   2.postid对应的post不存在或status为-1
# 的status设置为-1

import pymysql
db = pymysql.connect("localhost", "root", "Qw123456_", "lili")
c = db.cursor()

c.execute("select id,postid,status,t from pimg where status != -1")
pimgs = c.fetchall()
print("图片总数:" + str(len(pimgs)))

pimgs2 = []
for i in range(0, len(pimgs)):
    p = pimgs[i]
    pi = {}
    pi['id'] = p[0]
    pi['postid'] = p[1]
    pi['status'] = p[2]
    pi['t'] = p[3]
    pimgs2.append(pi)
pimgs = pimgs2

#
countPostNone = 0
countPostIdNone = 0
countIsAva = 0
for i in range(0, len(pimgs)):
    p = pimgs[i]

    #print(p)
    if p['postid'] == None:
        c.execute("select nickname,status from user where status != -1 and avaid=" + str(p['id']))
        user = c.fetchone()
        countPostIdNone = countPostIdNone + 1
        if user == None:
            c.execute("update pimg set status=-1 where id=" + str(p['id']))
            db.commit()
        else:
            if p['t'] != 2:
                c.execute("update pimg set t=2 where id=" + str(p['id']))
                db.commit()
            countIsAva = countIsAva + 1
        continue
    c.execute("select id,nickname,content,img,status from post where status != -1 and id=" + str(p['postid']))
    post = c.fetchone()
    #print(post)
    if post == None:
        c.execute("update pimg set status=-1 where id=" + str(p['id']))
        db.commit()
        countPostNone = countPostNone + 1

print("countPostIdNone=" + str(countPostIdNone))
print("countIsAva=" + str(countIsAva))
print("countPostNone=" + str(countPostNone))
