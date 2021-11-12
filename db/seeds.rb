# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

require 'csv'

User.destroy_all
Moon.destroy_all


CSV.foreach(Rails.root.join('lib/seed/moon.csv'), {:col_sep => "\t"}) do |row|
  Moon.create!( :date_time => Date.strptime(row[0], '%m/%d/%y'), :tide => row[1], :moon => row[2])
end
