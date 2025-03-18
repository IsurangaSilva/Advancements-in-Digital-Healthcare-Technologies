import tkinter as tk
from profileUser import ProfilePage  # Import Profile Page
from chat_history import ChatHistoryPage  # Import Chat History Page
from report import ReportPage  # Make sure this is the correct import for the revised ReportPage
from settings import SettingsPage
from dashboard import DashboardPage


root = tk.Tk()  
root.geometry("400x600")
root.title("Main Test")


menu_bar_color = "#383838"



#icons
toggle_icon = tk.PhotoImage(file="../assets/images/toggle_btn_icon.png")
home_icon = tk.PhotoImage(file="../assets/images/home_icon.png")
service_icon = tk.PhotoImage(file="../assets/images/services_icon.png")
update_icon = tk.PhotoImage(file="../assets/images/updates_icon.png")
contact_icon = tk.PhotoImage(file="../assets/images/contact_icon.png")
about_icon = tk.PhotoImage(file="../assets/images/about_icon.png")
close_btn_icon = tk.PhotoImage(file="../assets/images/close_btn_icon.png")



def switch_indication(indicator_lib,page):

    home_btn_indicator.config(bg=menu_bar_color)
    service_btn_indicator.config(bg=menu_bar_color)
    update_btn_indicator.config(bg=menu_bar_color)
    contact_btn_indicator.config(bg=menu_bar_color)
    about_btn_indicator.config(bg=menu_bar_color)
    indicator_lib.config(bg="white")

    if menu_bar_frame.winfo_width() > 45:
        fold_menu_bar()

    for frame in page_frame.winfo_children():
        frame.destroy()
    page()    

def extending_animation():
    current_width = menu_bar_frame.winfo_width()
    if not current_width > 200:
     current_width += 10
     menu_bar_frame.config(width=current_width)
     root.after(ms=8, func=extending_animation)

def extend_menu_bar():
    extending_animation()
    toggle_menu_btn.config(image=close_btn_icon)
    toggle_menu_btn.config(command=fold_menu_bar)



def folding_animation():
    current_width = menu_bar_frame.winfo_width()  

    if current_width != 45:
     current_width -= 10
     menu_bar_frame.config(width=current_width)
     root.after(ms=8, func=folding_animation)


def fold_menu_bar():
    folding_animation()
    toggle_menu_btn.config(image=toggle_icon)
    toggle_menu_btn.config(command=extend_menu_bar)    




def home_page():
   home_page = DashboardPage(page_frame, controller=None)  # Pass the parent frame and controller if necessary
   home_page.pack(fill=tk.BOTH, expand=True)  # Use
   
def service_page():
   service_page = ProfilePage(page_frame, controller=None)  # Pass the parent frame and controller if necessary
   service_page.pack(fill=tk.BOTH, expand=True)  # Use

def update_page():
    update_page = SettingsPage(page_frame, controller=None)  # Pass the parent frame and controller if necessary
    update_page.pack(fill=tk.BOTH, expand=True)  # Use

def contact_page():
    contact_page = ChatHistoryPage(page_frame, controller=None)  # Pass the parent frame and controller if necessary
    contact_page.pack(fill=tk.BOTH, expand=True)  # Use

def about_page():
    report_page = ReportPage(page_frame, controller=None)  # Pass the parent frame and controller if necessary
    report_page.pack(fill=tk.BOTH, expand=True)  # Use pack to display it within the page_frame





page_frame = tk.Frame(root,bg='#0E1628')
page_frame.place(relwidth=1.0, relheight=1.0, x=50)
home_page()

menu_bar_frame = tk.Frame(root, bg=menu_bar_color)

#menu bar
toggle_menu_btn = tk.Button(menu_bar_frame, image=toggle_icon, bg=menu_bar_color , bd=0, activebackground=menu_bar_color,command=extend_menu_bar)
toggle_menu_btn.place(x=4, y=10)


#home bar
home_btn = tk.Button(menu_bar_frame, image=home_icon, bg=menu_bar_color , bd=0, activebackground=menu_bar_color, command=lambda: switch_indication(indicator_lib=home_btn_indicator,page=home_page))    
home_btn.place(x=9, y=130,width=30, height=40)
home_btn_indicator = tk.Frame(menu_bar_frame, bg="white")
home_btn_indicator.place(x=3, y=130, width=3, height=40)

home_page_lb = tk.Label(menu_bar_frame, text="Home", bg=menu_bar_color, fg="white",font=("Bold", 15),anchor=tk.W)
home_page_lb.place(x=45, y=130, width=100, height=40)
home_page_lb.bind('<Button-1>', lambda e: switch_indication(indicator_lib=home_btn_indicator))



#service bar
service_btn = tk.Button(menu_bar_frame, image=service_icon, bg=menu_bar_color , bd=0, activebackground=menu_bar_color, command=lambda: switch_indication(indicator_lib=service_btn_indicator,page=service_page))
service_btn.place(x=9, y=190,width=30, height=40)
service_btn_indicator = tk.Frame(menu_bar_frame, bg=menu_bar_color)
service_btn_indicator.place(x=3, y=190, width=3, height=40)

service_page_lb = tk.Label(menu_bar_frame, text="Profile", bg=menu_bar_color, fg="white",font=("Bold", 15),anchor=tk.W)
service_page_lb.place(x=45, y=190, width=100, height=40) 
service_page_lb.bind('<Button-1>', lambda e: switch_indication(indicator_lib=service_btn_indicator))   

#update bar
update_btn = tk.Button(menu_bar_frame, image=update_icon, bg=menu_bar_color , bd=0, activebackground=menu_bar_color, command=lambda: switch_indication(indicator_lib=update_btn_indicator,page=update_page))
update_btn.place(x=9, y=250,width=30, height=40)
update_btn_indicator = tk.Frame(menu_bar_frame , bg=menu_bar_color) 
update_btn_indicator.place(x=3, y=250, width=3, height=40)

update_page_lb = tk.Label(menu_bar_frame, text="Settings", bg=menu_bar_color, fg="white",font=("Bold", 15),anchor=tk.W)
update_page_lb.place(x=45, y=250, width=100, height=40)
update_page_lb.bind('<Button-1>', lambda e: switch_indication(indicator_lib=update_btn_indicator))


#contact bar    
contact_btn = tk.Button(menu_bar_frame, image=contact_icon, bg=menu_bar_color , bd=0, activebackground=menu_bar_color, command=lambda: switch_indication(indicator_lib=contact_btn_indicator,page=contact_page))
contact_btn.place(x=9, y=310,width=30, height=40)
contact_btn_indicator = tk.Frame(menu_bar_frame, bg=menu_bar_color)
contact_btn_indicator.place(x=3, y=310, width=3, height=40)

contact_page_lb = tk.Label(menu_bar_frame, text="history", bg=menu_bar_color, fg="white",font=("Bold", 15),anchor=tk.W)
contact_page_lb.place(x=45, y=310, width=100, height=40)
contact_page_lb.bind('<Button-1>', lambda e: switch_indication(indicator_lib=contact_btn_indicator)) 

#about bar
about_btn = tk.Button(menu_bar_frame, image=about_icon, bg=menu_bar_color , bd=0, activebackground=menu_bar_color, command=lambda: switch_indication(indicator_lib=about_btn_indicator,page=about_page))
about_btn.place(x=9, y=370,width=30, height=40)
about_btn_indicator = tk.Frame(menu_bar_frame, bg=menu_bar_color)
about_btn_indicator.place(x=3, y=370, width=3, height=40)

about_page_lb = tk.Label(menu_bar_frame, text="Report", bg=menu_bar_color, fg="white",font=("Bold", 15),anchor=tk.W)
about_page_lb.place(x=45, y=370, width=100, height=40)
about_page_lb.bind('<Button-1>', lambda e: switch_indication(indicator_lib=about_btn_indicator)) 







menu_bar_frame.pack(side=tk.LEFT, fill=tk.Y , padx=3, pady=4)  
menu_bar_frame.pack_propagate(flag=False)

menu_bar_frame.config(width=45)

root.mainloop()
