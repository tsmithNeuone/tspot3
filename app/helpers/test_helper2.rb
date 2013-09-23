require 'json'

HEADERS = {"api_key"=>"jpzbffjtkq", "api_sig"=>"trkqwbhpylsdjsohgvyw"}
URL = ARGV[0].eql?("localhost") ?  "localhost:3000" : "truspotapi.neubus.com"
