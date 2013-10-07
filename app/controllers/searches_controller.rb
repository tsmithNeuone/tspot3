require 'json'
require "rest_client"

class SearchesController < ApplicationController
  before_action :set_search, only: [:show, :edit, :update, :destroy]

  # GET /searches
  # GET /searches.json
  def index
    @searches = Search.all
  end

  # GET /searches/1
  # GET /searches/1.json
  def show
  end

  # GET /searches/new
  def new
    @search = Search.new
  end

  # GET /searches/1/edit
  def edit
  end

  # POST /searches
  # POST /searches.json
  def create
    @search = Search.new(search_params)
    
    respond_to do |format|
      if @search.save
        params[:search][:latitude] = @search.latitude
        params[:search][:longitude] = @search.longitude
        format.html { redirect_to results_main_path(params), notice: 'Search was successfully created.' }
        format.json { render action: 'show', status: :created, location: @search }
      else
        format.html { render action: 'new' }
        format.json { render json: @search.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /searches/1
  # PATCH/PUT /searches/1.json
  def update
    respond_to do |format|
      if @search.update(search_params)
        format.html { redirect_to @search, notice: 'Search was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @search.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /searches/1
  # DELETE /searches/1.json
  def destroy
    @search.destroy
    respond_to do |format|
      format.html { redirect_to searches_url }
      format.json { head :no_content }
    end
  end

  def api_call_nearby #this is the wrapper for the api call to truspotApi. 
    #TODO: maybe move to a model? (idk how to do this yet...)
    api_headers = {"api_key"=>"jpzbffjtkq", "api_sig"=>"trkqwbhpylsdjsohgvyw"}
    lat = params[:lat] ||= '30.3356800079346'
    lng = params[:lng] ||= '-97.8045883178711'
    offset = params[:offset] ||= '0';
    
    api_url = "truspotapi.neubus.com"
    response1 = RestClient.get("http://#{api_url}/nearby?long=#{lng}&lat=#{lat}&offset=#{offset}&sort_order=ASC&category_id=1", api_headers)
    render json: response1
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_search
      @search = Search.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def search_params
      params.require(:search).permit(:address, :category, :latitude, :longitude)
    end
end
