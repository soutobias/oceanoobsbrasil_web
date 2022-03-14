class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [ :home ]

  def home
    @moons = Moon.where("date_time <  '#{Time.now.utc + (3600*24*15)}' AND date_time > '#{Time.now.utc - (3600*24*15)}'")
  end


  def admin
    if current_user.admin
      @data_types = Station.distinct(:data_type).select(:data_type).map {|data_type| data_type.data_type }
      @institutions = Station.distinct(:institution).select(:institution).map {|institution| institution.institution }  
      @query = ""
      if params[:commit].present?
        @commit = params[:commit]
        @data_type = params[:data_type]
        @institution = params[:institution]
        if @data_type != ""
          @query += "data_type = '#{@data_type}' AND "
        end
        if @institution != ""
          @query += "institution = '#{@institution}' AND "
        end
      end
      if @query != ""
        @query = @query[0..-6]
        if @query.downcase.include? 'drop'
          @stations = Station.all
        else
          @stations = Station.where(@query)
        end
      else
        @stations = Station.all
      end
      @station = Station.new
    else
      redirect_to root_path
    end
  end
end



