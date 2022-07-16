class StationsController < ApplicationController
    before_action :set_station, only: [:show, :graphs, :update, :destroy]
    skip_before_action :authenticate_user!, only: [ :graphs ]

    def show
        @language = params[:language]
    end

    def graphs
        @language = params[:language]
    end
    
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

# `<form action="/stations/${mark.station_id}" accept-charset="UTF-8" method="get">
#       <input type="text" name="language" id="language" value=${language} class="inactive-tab">
#       <input type="text" name="admin" id="admin" value=${admin} class="inactive-tab">
#       <button type="submit" class="btn m-0 p-0 collor-yellow" target="_blank">
#         <i class="fas fa-chart-pie"></i>
#       </button>
#     </form>`