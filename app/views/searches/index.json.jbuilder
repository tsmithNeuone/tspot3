json.array!(@searches) do |search|
  json.extract! search, :address, :category, :latitude, :longitude
  json.url search_url(search, format: :json)
end
