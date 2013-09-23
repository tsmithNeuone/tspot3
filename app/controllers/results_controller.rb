class ResultsController < ApplicationController
  def main
    @search = params[:search] #TODO maybe add a default case here.
  end
end
