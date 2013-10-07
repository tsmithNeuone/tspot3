require 'json'
require "rest_client"

class ResultsController < ApplicationController
  def main
    @search = params[:search] #TODO maybe add a default case here.
  end
  
  def vendor_detail_api
    api_headers = {"api_key"=>"jpzbffjtkq", "api_sig"=>"trkqwbhpylsdjsohgvyw"}
    offset = params[:offset] ||= '0';
    response1 = RestClient.get("http://#{api_url}/vendors/#{id}/detail", api_headers)
    render json: response1
  end
end
