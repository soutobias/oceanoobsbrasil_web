class ChangeMoon < ActiveRecord::Migration[6.0]
  def change
    change_column :moons, :moon, :string
  end
end
