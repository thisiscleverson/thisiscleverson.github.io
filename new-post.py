"""
Script para criar um arquivo template com os metadados

"""

import re
from datetime import datetime

from pelicanconf import PATH


DIRECTORY = f'./{PATH}/posts'


def ask_allow_comments():
    while True:
        comments_input = input('allow comments [yes/no]: ')
        
        if comments_input not in ['yes', 'no']:
            continue
        
        if comments_input == 'yes':
            return 'true'
        
        return 'false'
    

def get_tags():    
    print('Ex: tag1, tag2, ...')
    tags = input("tag : ").split(',')

    return tags


def remove_accents(string):
    return re.sub(r'[^\x00-\x7F]+', '', string)
    

def create_file(title, summary, comments, tags):
    date = datetime.now().strftime("%Y-%m-%d")

    title_formated = remove_accents(title).lower().replace(' ', '-') 
    
    filename = f'{DIRECTORY}/{date}-{title_formated}.md'
    
    with open(filename, 'a') as file:
        template = f'---\ntitle: {title}\ndate: {datetime.now().strftime("%Y-%m-%d %H:%M:%S% -0300")}\nsummary: "{summary}"\ncomments: {comments}\ntags: {tags}\nmastodonpost: ""\n---\n'        
        file.write(template)

    return filename


print('---New post---\n')
title = input('title: ')
summary = input('summary: ')
comments = ask_allow_comments()
tags = get_tags()

save_in = create_file(title, summary, comments, tags)

print(f'created new post: {save_in}')





