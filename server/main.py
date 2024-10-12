from langchain_experimental.agents import create_pandas_dataframe_agent
from langchain.llms import OpenAI
import pandas as pd
from openai_api_key import get_keys

def read_csv_into_dataframe(csv_name):
   df = pd.read_csv(csv_name)
   return df

def get_owid_dataframe():
    continents_to_drop = [
        'Africa',
        'Asia',
        'Central African Republic',
        'Central America',
        'Central Asia',
        'Eastern Africa',
        'Eastern Asia',
        'Eastern Europe',
        'Europe',
        'European Union',
        'Latin America',
        'Middle Africa',
        'North America',
        'Northern Africa',
        'Northern Europe',
        'Oceania',
        'South America',
        'South-Eastern Asia',
        'Southern Africa',
        'Southern Asia',
        'Southern Europe',
        'Western Africa',
        'Western Asia',
        'Western Europe',
        'World',
    ]

    data_frame = read_csv_into_dataframe("./Datasets/owid-energy-data.csv")

    data_frame = data_frame[~data_frame['Country'].isin(continents_to_drop)]
    data_frame = data_frame[~data_frame['Country'].str.endswith(' (EIA)')]
    data_frame = data_frame[~data_frame['Country'].str.endswith(' (EI)')]
    data_frame = data_frame[~data_frame['Country'].str.endswith(' (Shift)')]
    data_frame = data_frame[~data_frame['Country'].str.endswith(' (Ember)')]
    data_frame = data_frame[~data_frame['Country'].str.contains('-income countries')]
    data_frame = data_frame[~data_frame['Country'].str.contains('Europe')]
    data_frame = data_frame.drop(columns=[col for col in data_frame.columns if col.endswith('_per_capita')])
    return data_frame

def get_owid_units_dataframe():
    data_frame = read_csv_into_dataframe("./Datasets/owid-energy-codebook.csv")
    return data_frame

def create_pandas_agent():
    data_frame = get_owid_dataframe()

    llm = OpenAI(temperature=0.7, openai_api_key = get_keys())

    return create_pandas_dataframe_agent(
        handle_parsing_errors = True,
        allow_dangerous_code = True,
        llm = llm,
        df = data_frame,
        verbose = True,
        return_intermediate_steps = True
    )

class LLM:
    def __init__(self):
        self.p_agent = create_pandas_agent()
        
        data_frame_units = get_owid_units_dataframe()
        data_frame_units.drop(columns=['description', 'source'], inplace=True)
        data_frame_units = data_frame_units[~data_frame_units['unit'].isnull()]

        self.data_frame_units = data_frame_units

    def query(self, query):
        try:
            lower_query = query.lower()
            if "per capita" in lower_query:
                query = f'{query} Make sure to divide the result by the population of the country.'
            query = f'{query} Explain your reasoning to the user without mentioning the use of a dataframe.'
            return self.p_agent.invoke(query)
        except Exception as e:
            print(e)
            return "An error occurred while processing the query."

llm = LLM()
final_answer = llm.query("Which country used the most nuclear energy in 2019?")
intermediate_steps = final_answer['intermediate_steps']
print(final_answer)