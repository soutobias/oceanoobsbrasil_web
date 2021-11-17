class StationsController < ApplicationController
    before_action :set_station, only: [:show, :update, :destroy]

    def show
        # @station_values = get_remobs(@almirantado_int, start_data)
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
    
    # def get_remobs(buoy, start_date, end_date)
    #     if buoy.buoy_id
    #       begin
    #         response = RestClient.get("http://remobsapi.herokuapp.com/api/v1/data_buoys?buoy=#{buoy.buoy_id.to_i}&start_date=#{start_date.strftime("%Y-%m-%d")}&end_date=#{end_date.strftime("%Y-%m-%d")}&token=#{ENV["REMOBS_TOKEN"]}")
    
    #         remobs_response = JSON.parse(response)
    
    #         params = {}
    #         params[:swvht] = []
    #         params[:mxwvht] = []
    #         params[:tp] = []
    #         params[:sst] = []
    #         params[:wvspread] = []
    #         params[:wvdir] = []
    #         params[:date_time] = []
    #         params[:buoy_id] = []
    #         params[:wspd] = []
    #         params[:wdir] = []
    #         params[:gust] = []
    #         params[:wvdirg] = []
    #         params[:wdirg] = []
    
    #         remobs_response.each do |item|
    #           params[:buoy_id] << item['buoy_id']
    
    #           if item['flag_swvht'].to_i > 0
    #             params[:swvht] << nil
    #           else
    #             params[:swvht] << item['swvht1'].to_f
    #           end
    
    #           if item['flag_mxwvht'].to_i > 0
    #             params[:mxwwvht] << nil
    #           else
    #             params[:mxwvht] << item['mxwvht1'].to_f
    #           end
    
    #           if item['flag_tp'].to_i > 0
    #             params[:tp] << nil
    #           else
    #             params[:tp] << item['tp1'].to_f
    #           end
    
    #           if item['flag_sst'].to_i > 0
    #             params[:sst] << nil
    #           else
    #             params[:sst] << item['sst'].to_f
    #           end
    
    #           if item['flag_wvspread'].to_i > 0
    #             params[:wvspread] << nil
    #           else
    #             params[:wvspread] << item['wvspread1'].to_f
    #           end
    
    #           params[:date_time] << Time.parse(item['date_time'])
    
    #           if item['flag_wdir'].to_i > 0
    #             params[:wdir] << nil
    #           else
    #             params[:wdir] << item['wdir'].to_i
    #           end
    
    #           if item['flag_wdir'].to_i > 0
    #             params[:wdirg] << nil
    #           else
    #             params[:wdirg] << (item['wdir'].to_i/10)*10
    #           end
    
    #           if item['flag_gust'].to_i > 0
    #             params[:gust] << nil
    #           else
    #             params[:gust] << item['gust'].to_f
    #           end
    
    #           if item['flag_wspd'].to_i > 0
    #             params[:wspd] << nil
    #           else
    #             params[:wspd] << item['wspd'].to_f
    #           end
    
    #           if item['flag_wvdir'].to_i > 0
    #             params[:wvdir] << nil
    #           else
    #             params[:wvdir] << item['wvdir1'].to_f
    #           end
    
    #           if item['flag_wvdir'].to_i > 0
    #             params[:wvdirg] << nil
    #           else
    #             params[:wvdirg] << (item['wvdir1'].to_i/10)*10
    #           end
    #         end
    #         return params
    #       rescue
    #         return {}
    #       end
    #     else
    #       return {}
    #     end
    #   end
    # end
end
