import os
import requests
import datetime

# Retrieve API key from environment variable - Github Secrets
API_KEY = os.getenv("OPENAQ_API_KEY")

TODAY = datetime.datetime.now() 

# Location ID for Cologne City
location_id = 2162203

# Endpoint to retrieve sensors for the location
url = f'https://api.openaq.org/v3/locations/{location_id}/sensors'
headers = {
    'X-API-Key': API_KEY
}

def fetch_sensor_ids():
    """
    Fetches the sensor IDs for a given location.
    """
    if not API_KEY:
        return {"error": "API Key is missing!"}
    
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        sensors = data.get('results', [])
        return [sensor['id'] for sensor in sensors]
    else:
        return {"error": f"Failed to retrieve sensors. Status: {response.status_code}, {response.text}"}


def fetch_measurements(sensor_id):
    """
    Fetches the last 10 daily measurements for a given sensor.
    """
    from_date = TODAY - datetime.timedelta(days=5)
    till_date = TODAY
    url = f'https://api.openaq.org/v3/sensors/{sensor_id}/measurements/daily'
    params = {
        'limit': 10,
        'datetime_to': till_date.isoformat(),
        'datetime_from': from_date.isoformat()
    }
    
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        data = response.json()
        measurements = data.get('results', [])
        
        return [
            {
                "sensor_id": sensor_id,
                "date": measurement['period']['datetimeFrom']['utc'],
                "parameter": measurement['parameter']['name'],
                "value": measurement['value'],
                "unit": measurement['parameter']['units']
            }
            for measurement in measurements
        ]
    else:
        return {"error": f"Failed to retrieve measurements for sensor {sensor_id}. Status: {response.status_code}, {response.text}"}


# Main execution
def get_air_quality_data():
    """
    Fetches air quality data from OpenAQ API and returns structured JSON-like data.
    """
    sensor_ids = fetch_sensor_ids()
    
    if isinstance(sensor_ids, dict) and "error" in sensor_ids:
        return sensor_ids  # Return error message if sensor fetching failed
    
    all_measurements = []
    for sensor_id in sensor_ids:
        measurements = fetch_measurements(sensor_id)
        all_measurements.extend(measurements)
    
    return all_measurements

if __name__ == "__main__":
    air_quality_data = get_air_quality_data()
    print(air_quality_data)  
