class ResultsController < ApplicationController
  def main
    @search = params[:search]
    @address = @search[:address]
  end
end
