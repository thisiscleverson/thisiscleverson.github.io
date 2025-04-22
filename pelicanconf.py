AUTHOR = 'Cleverson Silva'
TITLE = 'this_is_cleverson'
DESCRIPTION = "Apenas um latino-americano tentando falar sobre este vasto mundo da tecnologia e a complexa vida..."
BASEURL = ""
SITEURL = "https://thisiscleverson.github.io"
EMAIL = "cleverson.silva.contact@gmail.com"


PATH = "content"
STATIC_PATHS = ['media']
THEME = "theme"
TIMEZONE = 'America/Sao_Paulo'
DEFAULT_LANG = 'en'


PAGE_URL = '{slug}.html'
PAGE_SAVE_AS = '{slug}.html'


DISPLAY_PAGES_ON_MENU = False


# Social widget
SOCIAL_LINKS = [
    {
        'link': 'https://github.com/thisiscleverson',
        'icon_type': 'png',
        'icon': 'images/github.png',
        'width': '20px',
        'margin_left': '-5px',
        'site': 'github',
        'username': 'thisiscleverson',
    },
    {
        'link': 'https://bolha.us/@cleverson',
        'icon_type': 'png',
        'icon': 'images/mastodon.png',
        'width': '20px',
        'margin_left': '-5px',
        'site': 'mastodon',
        'username': 'cleverson',
    },
    {
        'link': 'https://www.linkedin.com/in/cleverson-silva/',
        'icon_type': 'png',
        'icon': 'images/In-Blue.png',
        'width': '20px',
        'margin_left': '-5px',
        'site': 'linkedisney',
        'username': 'cleverson-silva',
    }
]


DEFAULT_PAGINATION = 10


PLUGINS = [
    'pelican.plugins.yaml_metadata',
    'minchin.pelican.plugins.wikilinks',
]


# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True


MARKDOWN = {
    "extension_configs": {
        "markdown.extensions.admonition": {},
        "markdown.extensions.codehilite": {
            "css_class": "highlight"
        },
        "markdown.extensions.extra": {},
        "markdown.extensions.meta": {},
        "markdown.extensions.toc": {
            "permalink": " "
        },
    },
    "output_format": "html5",
}
