class CreateStations < ActiveRecord::Migration[6.0]
  def change
    create_table :stations do |t|

      t.timestamps
    end
  end
end
