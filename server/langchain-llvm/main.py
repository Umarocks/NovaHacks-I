from langchain_experimental.agents import create_pandas_dataframe_agent
from langchain.llms import OpenAI
import pandas as pd

def read_csv_into_dataframe(csv_name):
   df = pd.read_csv(csv_name)
   return df

data_frame = read_csv_into_dataframe("./Datasets/agricultural-land.csv")
print (data_frame.head())