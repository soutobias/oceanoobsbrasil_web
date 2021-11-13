class StationsController < ApplicationController
    before_action :set_station, only: [:update, :destroy]

    def create
        if current_user.admin
            @data_types = Station.distinct(:data_type).select(:data_type).map {|data_type| data_type.data_type }
            @institutions = Station.distinct(:institution).select(:institution).map {|institution| institution.institution }
            @station = Station.new(station_params)
            @station.id = Station.maximum(:id) + 1
            @station.save
            @stations = Station.all
            @data_type = @station.data_type
            @station = Station.new
            redirect_to admin_path
        else
            redirect_to root_path
        end
    end
  
    def update
        if current_user.admin
            @data_types = Station.distinct(:data_type).select(:data_type).map {|data_type| data_type.data_type }
            @institutions = Station.distinct(:institution).select(:institution).map {|institution| institution.institution }

            @station.update(station_params)
            @stations = Station.all
            @data_type = @station.data_type
            @station = Station.new
            redirect_to admin_path
        else
            redirect_to root_path
        end
    end
  
    def destroy
        if current_user.admin
            begin
                @station.destroy
            rescue
            end    
            @data_types = Station.distinct(:data_type).select(:data_type).map {|data_type| data_type.data_type }
            @institutions = Station.distinct(:institution).select(:institution).map {|institution| institution.institution }

            @stations = Station.all
            @data_type = @station.data_type
            @station = Station.new
            redirect_to admin_path
        else
            redirect_to root_path
        end
    end

    private
    def set_station
      @station = Station.find(params[:id])
    end
  
    def station_params
      params.require(:station).permit(:id, :name, :lat, :lon, :data_type, :institution, :url)
    end
end
