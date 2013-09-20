class CreateSearches < ActiveRecord::Migration
  def change
    create_table :searches do |t|
      t.string :address
      t.string :category
      t.float :latitude
      t.float :longitude

      t.timestamps
    end
  end
end
