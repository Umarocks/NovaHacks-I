# app/services/langchain_service.py

# app/services/langchain_service.py

import pandas as pd
from app.models.langchain_model import create_pandas_agent
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError

class LLM:
    def __init__(self):
        self.p_agent = create_pandas_agent()

    def query(self, query):
        try:
            lower_query = query.lower()
            # if "per capita" in lower_query:
            #     query = f"{query} Make sure to divide the result by the population of the country."
            # else:
            #     query = f"{query} If the user asks for something unreleated, please respond \"I cannot help with that.\""
            # query = f"{query} Explain your reasoning to the user without mentioning the use of a dataframe."
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
    return final_answer["output"]

owid_energy_data = [pd.read_csv("./Datasets/owid-energy-data.csv")]
lat_long_data = [pd.read_csv("./Datasets/lat-long.csv")]
lat_long_data[0] = lat_long_data[0][["Alpha-3 code", "Latitude (average)", "Longitude (average)"]]

geolocator = Nominatim(user_agent="langchain_service")

def get_lat_lon(country_name):
    location = geolocator.geocode(country_name)
    if location:
        return location.latitude, location.longitude
    else:
        return 'Country not found'


def get_information_by_territory_service( country_name, year, parameter):
    
    df=pd.read_csv("./Datasets/owid-energy-data.csv")
    ans = []
    if(country_name ==[]):
        country_name = ['Luxembourg']
    for country in country_name:
        latitude,longitude = get_lat_lon(country)
        
        data_frame=df[(df['Year'] == int(year)) & (df['Country'] == country)][parameter]
        result = data_frame.values[0]
        if pd.isna(result):
            result = 'no data'
        else:
            result = int(result)
        parameter_max = df[parameter].max() if not pd.isna(df[parameter].max()) else 0
        parameter_min = df[parameter].min() if not pd.isna(df[parameter].min()) else 0
        
        ans.append({
                 "lat": latitude,
                 "lon": longitude,
                 "Country": country,
                 "Year": year,
                 "parameter":result,
                 "parameterName": parameter,
                 "parameter_max": parameter_max,
                 "parameter_min": parameter_min,
        })
      

  
    print(ans)
       
    return  ans