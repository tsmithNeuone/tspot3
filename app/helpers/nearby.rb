require "rest_client"
require File.expand_path("../test_helper2.rb", __FILE__)

response1 = RestClient.get("http://#{URL}/nearby?long=-97.8045883178711&lat=30.3356800079346&sort_order=ASC&category_id=1", HEADERS)

puts response1
