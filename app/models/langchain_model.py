# app/models/langchain_model.py

import pandas as pd
from langchain_experimental.agents import create_pandas_dataframe_agent
from langchain.llms import OpenAI
from openai_api_key import get_keys

# Function to load the CSV data and create the LangChain agent
def create_langchain_agent():
    # Load the dataset into a pandas DataFrame
    data_frame = pd.read_csv("./Datasets/owid-energy-data.csv")

    # Drop certain columns
    data_frame = data_frame.drop(columns=[col for col in data_frame.columns if col.endswith('_per_capita')])

    # Initialize OpenAI LLM
    llm = OpenAI(temperature=0.5, openai_api_key=get_keys())

    # Create the LangChain agent with the dataframe and LLM
    p_agent = create_pandas_dataframe_agent(
        handle_parsing_errors=True,
        allow_dangerous_code=True,
        llm=llm,
        df=data_frame,
        verbose=True
    )
    
    return p_agent
