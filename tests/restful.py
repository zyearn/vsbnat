#!/usr/bin/env python
import web
import xml.etree.ElementTree as ET

tree = ET.parse('user_data.xml')
root = tree.getroot()

urls = (
    '/users', 'list_users',
    '/users/(.*)', 'get_user',
    '/put/(.*)', 'put_user'
)

app = web.application(urls, globals())

class list_users:        
    def GET(self):
        output = 'users:[';
        for child in root:
            print 'child', child.tag, child.attrib
            output += str(child.attrib) + ','
        output += ']';
        return output


class get_user:
    def GET(self, user):
        for child in root:
            if child.attrib['id'] == user:
                return str(child.attrib)

class put_user:
    def PUT(self, user):
        return "suc, " + user + " " + web.data();

if __name__ == "__main__":
    app.run()
