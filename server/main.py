from langchain_experimental.agents import create_pandas_dataframe_agent
from langchain.llms import OpenAI
import pandas as pd
from openai_api_key import get_keys
llm = OpenAI(temperature=0.3, openai_api_key = get_keys())

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

    return create_pandas_dataframe_agent(
        handle_parsing_errors = True,
        allow_dangerous_code = True,
        llm = llm,
        df = data_frame,
        verbose = True
    )

class LLM:
    def new(self):
        self.p_agent = create_pandas_agent()
        
        data_frame_units = get_owid_units_dataframe()
        data_frame_units.drop(columns=['description', 'source'], inplace=True)
        data_frame_units = data_frame_units[~data_frame_units['unit'].isnull()]

        self.data_frame_units = data_frame_units

    def query(self, query):
        query = f'{query}\n{self.data_frame_units}'
        return self.p_agent.invoke(query)

llm = LLM()
llm.query("Which country was consuming biofuel the most per capatia in 2019?")