class Search < ActiveRecord::Base
  geocoded_by :address   # can also be an IP address
  validates_presence_of :address
  after_validation :geocode  
end
