fetch("https://www.foodora.cz/login/new/api/email-check", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "cs,cs-CZ;q=0.9,en;q=0.8",
    "content-type": "application/json;charset=UTF-8",
    "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "cookie": "dhhPerseusGuestId=1682342499761.494618588115182500.0ogmbzx1i8; ld_key=1682342499761.494618588115182500.0ogmbzx1i8; hl=cs; _pxhd=b9-6pA1ZjCIydcnlUBqoxfUGOi0zPSV4rJ2XeoFvAKRTRPDuy83Ywp4dtBIaGwD9SJLff/SGG3Jw10gY1AnyAQ==:xgy3KIOKJoYU8MB171oYdlM0XMwhzgMgI63YrR5vF4GkMYV7nmKav9zQRVT6OveiAeN2yFKeEq-VqvL3rbnro8g/4sC4uFp/mJiQCOsuNP8=; _pxvid=f25d839d-e2a2-11ed-8de0-56686b676141; pxcts=f3497211-e2a2-11ed-a491-47536b574d49; device_token=eyJhbGciOiJSUzI1NiIsImtpZCI6ImtleW1ha2VyLXZvbG8tZGV2aWNlLWRqLWN6IiwidHlwIjoiSldUIn0.eyJpZCI6ImFjYzliNTJkLWM2YTYtNDVlOC04ZmRkLTEzOTYwYjc1YWYyYyIsImNsaWVudF9pZCI6InZvbG8iLCJ1c2VyX2lkIjoiY3o5a3M2d3UiLCJleHBpcmVzIjo0ODM2MjI1OTMzLCJ0b2tlbl90eXBlIjoiYmVhcmVyIiwic2NvcGUiOiJERVZJQ0VfVE9LRU4ifQ.wu-pM352QfezCYr26PycitMlae09zjH04iB0amqsmLmgjtiP-4tUY-ljwCET2mrontSzklQzjWoAtiM256QN6JJ7xWjqMZ-3esSFUWj_dXM_GC6nHfKX-gy5cYjlXYtR3WFZ7119CKOzhP8ndKlBCbV3sCRg9g67r8mhYKG0RqyQiZkIc0G-YRQaht9fD7fAsQQP66Q5jUvZ_MrMRXlyJfNpLT5tFWTwjLswYBAqO3W2UC8KSRMoXhxhdwpLXrQpCh4aAXAotlbHLihOtFmDeyEtGM0dYw9stlG-r1Bem8lFb_MeSLoHiCZ1RwjqABMFQ3QIUH_9vFSqyduYFA2zoQ; dhhPerseusSessionId=1683576552240.276225049299267940.tbkv5vp0h8; dps-session-id=50.20698_15.81037_1682342499761.494618588115182500.0ogmbzx1i8_1683576555_1683578355; userCentrics_Braze=true; userCentrics_BrazeSDK=false; userCentrics_FacebookPixel=false; userCentrics_GoogleAdsRemarketing=false; userCentrics_TVSquared=false; userCentrics_Twitter=false; userCentrics_GoogleAnalytics=false; userCentrics_Perseus=true; userCentrics_Hotjar=false; userCentrics_BingConversion=false; userCentrics_TradeTracker=undefined; userCentrics_LinkedInAds=false; userCentrics_TradeDesk=false; userCentrics_Sklik=false; userCentrics_PerimeterX=true; data-download-JSON=1683576628515; _px3=877092de9ed5b4dc18995d562d3def6a458ad00a2f792ab7173f8dd0f798e06a:dnF+XbjMI1kqYELxVkSsjlNjNJ/BE9Scx4SZuepQcaa3GhW83G2lQeVw9nKReP3PwMDEBv6blbDC5nBYGhRbqw==:1000:g+g3vdrPTMr7FUY9p95FXBkQEhoe0+jk0Cq4slDmauuBCx5mKsY/b5poLq9RvCHK9+q7KnhWsQXJw5NZ1oeT+cojkFZzIODyH6vdkO+8U8fCyBnIwx2ReVmmdN8jD1n/TATMvRBFt5DSH9Q4J+egDzPekCtdybAcpwnhPDuozPl0crmooLxpLi25JQqOsoT/6nXNqZx/4t3fOHzIKKnsDA==; g_state={\"i_p\":1683584211742,\"i_l\":1}; dhhPerseusHitId=1683577022843.815992354618487900.moyadxek5h; _dd_s=logs=1&id=01bbb2f2-36fe-437d-a0a9-fe23ff30beb7&created=1683576553594&expire=1683577945556",
    "Referer": "https://www.foodora.cz/login/new?step=email",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": "{\"email\":\"jiri.hofman@gmail.com\"}",
  "method": "POST"
});

Authenticate with username/password (this is no Oauth)
curl -i -v 'https://www.foodora.cz/login/new/api/login' \
  -H 'authority: www.foodora.cz' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-language: cs,cs-CZ;q=0.9,en;q=0.8' \
  -H 'content-type: application/json;charset=UTF-8' \
  -H 'dnt: 1' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36' \
  --data-raw '{"username":"jiri.hofman@gmail.com","password":"vtipec22","platform":"b2c"}' \
  --compressed

Get tokens from cookies
token=eyJhbGciOiJSUzI1NiIsImtpZCI6ImtleW1ha2VyLXZvbG8tZGotY3oiLCJ0eXAiOiJKV1QifQ.eyJpZCI6Ijl6eTM0c2J0aTc4YngxbTY0aDQ2YWZjZnRzdTY3dWtnaDF5dGplYnAiLCJjbGllbnRfaWQiOiJ2b2xvIiwidXNlcl9pZCI6ImN6OWtzNnd1IiwiZXhwaXJlcyI6MTY4MzU4MDczNCwidG9rZW5fdHlwZSI6ImJlYXJlciIsInNjb3BlIjoiQVBJX0NVU1RPTUVSIEFQSV9SRUdJU1RFUkVEX0NVU1RPTUVSIn0.MsaIqw-bG6RLH26g89bkSlAVMpeQ5tGkG6zHnLE5nPAjH82UztteY7eIhHmm_007cmt-KmOJTlvP7V-h5haEWG6m99eRQ5x4A3ckZmTRx83K1fhsprZWKtrVTSCQJlNQWkAJzeY9HBZxGhr_ZyGkEaqfJqRCClSXYSmDoxsSUl7HprwRyZUs1vBKr5VnOI5pzKULhIg0LtTNDQOvPhXlEHYSdeRdSxe6TMQ9aIL9mJT7TJ0051TyLMmAdj47M_lUcT29X7vm56aDGqF4NOQ3jiDlK2FVMns5JEp2A2-pCZF0-dg04ylb-XoOya15DZZXGBbiqQjZNa2vT8p7lZmhJQ; Path=/; Expires=Mon, 08 May 2023 21:18:54 GMT; Secure
device_token=eyJhbGciOiJSUzI1NiIsImtpZCI6ImtleW1ha2VyLXZvbG8tZGV2aWNlLWRqLWN6IiwidHlwIjoiSldUIn0.eyJpZCI6ImFjYzliNTJkLWM2YTYtNDVlOC04ZmRkLTEzOTYwYjc1YWYyYyIsImNsaWVudF9pZCI6InZvbG8iLCJ1c2VyX2lkIjoiY3o5a3M2d3UiLCJleHBpcmVzIjo0ODM2MjI1OTMzLCJ0b2tlbl90eXBlIjoiYmVhcmVyIiwic2NvcGUiOiJERVZJQ0VfVE9LRU4ifQ.wu-pM352QfezCYr26PycitMlae09zjH04iB0amqsmLmgjtiP-4tUY-ljwCET2mrontSzklQzjWoAtiM256QN6JJ7xWjqMZ-3esSFUWj_dXM_GC6nHfKX-gy5cYjlXYtR3WFZ7119CKOzhP8ndKlBCbV3sCRg9g67r8mhYKG0RqyQiZkIc0G-YRQaht9fD7fAsQQP66Q5jUvZ_MrMRXlyJfNpLT5tFWTwjLswYBAqO3W2UC8KSRMoXhxhdwpLXrQpCh4aAXAotlbHLihOtFmDeyEtGM0dYw9stlG-r1Bem8lFb_MeSLoHiCZ1RwjqABMFQ3QIUH_9vFSqyduYFA2zoQ; Max-Age=315360000; Path=/; Expires=Thu, 05 May 2033 20:18:54 GMT; Secure
refresh_token=jikx9dgt9saglil5pmmv8wc9kjfcsjp8qfgnwxnl; Max-Age=31536000; Path=/; Expires=Tue, 07 May 2024 20:18:54 GMT; Secure
