class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [ :home ]

  def home
    @moons = Moon.where("date_time <  '#{Time.now.utc + (3600*24*15)}' AND date_time > '#{Time.now.utc - (3600*24*15)}'")
  end
end



