# NovaHacks-I

# Building from source:

1. Clone the repo `git clone https://github.com/Umarocks/NovaHacks-I`

2. Activate the python venv on the command line. </br>
    Windows: `./server/langchain-llvm/Scripts/activate` </br>
    Linux: `source venv ./server/langchain-llvm/bin/activate`

3. Edit the `open_api_key.py` file on the toplevel directory:
Please contact me for the key.

```python
def get_keys():
    return "<YOUR API KEY HERE>"
```

4. Install all needed dependencies from the `dependencies.txt` file.

5. Execute the application `python ./server/langchain-llvm/main.py`