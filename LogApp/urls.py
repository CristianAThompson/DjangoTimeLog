from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^update_times/$', views.update_times, name='update_times'),
]
