#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Mar 30 22:32:52 2020

@author: Mariusz
"""

import xml.etree.ElementTree as ET
from xml.etree.ElementTree import Element
import json

#ET.register_namespace('', 'http://www.w3.org/2000/svg')
json_file = open('state_abbreviations.json','r')
state_dict = json.load(json_file)




for state in state_dict.keys():
    tree = ET.parse('USA_Counties.svg')
    root = tree.getroot()
    for finder in tree.findall("{http://www.w3.org/2000/svg}path"):
        root.remove(finder)
    
    
    g_tag = tree.find('{http://www.w3.org/2000/svg}g')
    paths = {'',''}
    tester = g_tag.iter('{http://www.w3.org/2000/svg}path')#{http://www.w3.org/2000/svg}path'):
    toremove=[]
    for path in tester:   
        command='handleMouseOverCounty("'+path.attrib['id'].replace("__",'",abbrevToStates["')+'"])'
        #print(command)
        path.set("onmouseover",command)
        if state != path.attrib['id'].split('__')[-1]:
            toremove.append(path)
    for remove in toremove:
        g_tag.remove(remove)
    tree.write(state_dict[state] + ".svg")