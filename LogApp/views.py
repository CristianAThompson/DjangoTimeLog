from django.shortcuts import render
from django.http import HttpResponse

import json

def index(request):
    # return HttpResponse("Hello, world. You're at the Time Logging index.")
    return render(request, 'index.html')

def update_times(request):
    if request.method == 'POST':
        title_data = request.POST.get('title')
        hours_data = request.POST.get('hours')
        minutes_data = request.POST.get('minutes')
        seconds_data = request.POST.get('seconds')
        start_date_data = request.POST.get('startDate')
        start_data = request.POST.get('started')
        end_data = request.POST.get('ended')
        end_date_data = request.POST.get('endDate')
        response_data = ''
        if title_data:
            response_data += '<p>Project Title: ' + title_data
        if start_date_data:
            response_data += '</p><p> --- Start Date: ' + start_date_data + ' || '
        if start_data:
            response_data += 'Started: ' + start_data
        if end_data:
            response_data += ' - Ended: ' + end_data + ' || '
        if end_date_data:
            response_data += ' End Date: ' + end_date_data + ' --- </p><p>'
        if hours_data:
            response_data += ' Hours: ' + hours_data + ' | '
        if minutes_data:
            response_data += ' Minutes: ' + minutes_data + ' | '
        if seconds_data:
            response_data += ' Seconds: ' + seconds_data + '</p>'



        return HttpResponse(
            json.dumps(response_data),
            # json.dumps("This Happened."),
            content_type="application/json"
        )
    else:
        return HttpResponse(
            json.dumps({"nothing to see": "this isn't happening"}),
            content_type="application/json"
        )
