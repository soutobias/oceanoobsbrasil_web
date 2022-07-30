class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [ :home ]

  def home
    @moons = Moon.where("date_time <  '#{Time.now.utc + (3600*24*15)}' AND date_time > '#{Time.now.utc - (3600*24*15)}'")
    @total_stations = get_total_stations
    @moons = Moon.where("date_time <  '#{Time.now.utc + (3600*24*15)}' AND date_time > '#{Time.now.utc - (3600*24*15)}'")
    @language = 'pt-br'
    if params[:language] == "en"
      @language = 'en'
    elsif params[:language] == "pt-br"
      @language = 'pt-br'
    end
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
        @stations = {}
      end
      @station = Station.new
    else
      redirect_to root_path
    end
  end

  private

  def get_total_stations()
    params = {}
    begin
      response = RestClient.get("https://remobsapi.herokuapp.com/api/v1/data_stations/distinct?token=#{ENV["OCEANOBS_API_KEY2"]}")
      remobs_response = JSON.parse(response)
      params[:total_stations] = (remobs_response['total_stations'].to_i)

      response = RestClient.get("https://remobsapi.herokuapp.com/api/v1/data_no_stations/distinct?token=#{ENV["OCEANOBS_API_KEY2"]}")
      remobs_response = JSON.parse(response)
      params[:total_no_stations] = (remobs_response['total_stations'].to_i)

      params[:total] = params[:total_stations] + params[:total_no_stations]
      return params
    rescue
      return {}
    end
  end
  
end



