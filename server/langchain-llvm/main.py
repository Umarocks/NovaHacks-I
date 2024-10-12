from langchain_experimental.agents import create_pandas_dataframe_agent
from langchain.llms import OpenAI
import pandas as pd
from openai_api_key import get_keys

def read_csv_into_dataframe(csv_name):
   df = pd.read_csv(csv_name)
   return df

data_frame = read_csv_into_dataframe("./Datasets/owid-energy-data.csv")

data_frame = data_frame.drop(columns=[col for col in data_frame.columns if col.endswith('_per_capita')])

print (data_frame.head())

llm = OpenAI(temperature=0.5, openai_api_key = get_keys())

p_agent = create_pandas_dataframe_agent(handle_parsing_errors=True,allow_dangerous_code=True,llm=llm,df=data_frame,verbose=True)

p_agent.invoke("how do they put the chocolate in chocolate milk?")