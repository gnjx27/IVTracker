from .services.calculate_iv import calculate_iv, fetch_us_treasury_rates, create_interpolator
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import APIException

class GetIVPoints(APIView):
    """
    API endpoint to generate IV points
    """
    def post(self, request):
        try:
            # Get parameters from request body
            data = json.loads(request.body)
            ticker = data.get("ticker")
            q = float(data.get("q"))
            min_strike_pct = float(data.get("min_strike_pct"))
            max_strike_pct = float(data.get("max_strike_pct"))

            # Fetch treasury rates and create interpolator
            rates = fetch_us_treasury_rates();
            r_interp = create_interpolator(rates)

            # Calculate IV Points using the interpolator
            result = calculate_iv(
                ticker,
                q,
                min_strike_pct,
                max_strike_pct,
                r_interp
            )

            return Response(result)

        except Exception as e:
            raise APIException(detail=str(e))