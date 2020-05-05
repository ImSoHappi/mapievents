from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request, 'mapi_app/base.html', {})