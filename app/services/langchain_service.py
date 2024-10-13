# app/services/langchain_service.py

# app/services/langchain_service.py

import pandas as pd
from app.models.langchain_model import create_pandas_agent

class LLM:
    def __init__(self):
        self.p_agent = create_pandas_agent()

    def query(self, query):
        try:
            lower_query = query.lower()
            if "per capita" in lower_query:
                query = f'{query} Make sure to divide the result by the population of the country.'
            else:
                query = f'{query} If the user asks for something unreleated, please respond "I cannot help with that."'
            query = f'{query} Explain your reasoning to the user without mentioning the use of a dataframe.'
            return self.p_agent.invoke(query)
        except Exception as e:
            print(e)
            return "An error occurred while processing the query."

llm = [LLM()]
# Function to handle the prompt using the LangChain agent
def handle_prompt_service(prompt):
    large_language_model = llm[0]
    final_answer = large_language_model.query(prompt)
    print(final_answer)
    return final_answer['output']

def get_information_by_territory_service(territory, year, parameter):
    year = str(year).trim()

    data_frame = pd.read_csv("./Datasets/owid-energy-data.csv")
    data_frame[~data_frame['Year'].str == year]
    #data_frame.drop(subset=[parameter])
    data_frame = data_frame[['Country', parameter]]

    # Placeholder function for getting information by territory
    return {"territory": territory, "year": year, "parameter": parameter}