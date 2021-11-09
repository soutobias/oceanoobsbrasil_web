class CreateMoons < ActiveRecord::Migration[6.0]
  def change
    create_table :moons do |t|
      t.datetime :date_time
      t.string :tide
      t.numeric :moon
      t.timestamps
    end
  end
end
