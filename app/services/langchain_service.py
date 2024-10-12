# app/services/langchain_service.py

# app/services/langchain_service.py

import pandas as pd
from langchain_experimental.agents import create_pandas_dataframe_agent
from langchain.llms import OpenAI
from openai_api_key import get_keys

# Function to handle the prompt using the LangChain agent
def handle_prompt_service(prompt):
    # Load your CSV data
    data_frame = pd.read_csv("./Datasets/owid-energy-data.csv")
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

    # Use the agent to process the prompt
    response = p_agent.invoke(prompt)
    print(response+"HEHHEHEHE")
    return response
