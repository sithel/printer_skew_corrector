# printer_skew_corrector
A tool to analyze and correct PDFs to compensate for the misalignment of home printers


## Setup

Due to "[CORS fuckery](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSRequestNotHttp#loading_a_local_file)" as Cocoa puts it, you need to host the content in order for the JS to work. 

I often run:

```
$ python -m SimpleHTTPServer 8000
```

from the main directory.