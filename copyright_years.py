from datetime import date

init_launch_yr = 2022

def build_copyright_years():
	currentyr = date.today().year
	yrstr = str(init_launch_yr)
	if currentyr>init_launch_yr:
		yrstr += "–" + str(currentyr)
	return yrstr