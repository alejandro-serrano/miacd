import json, matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
r=json.load(open('results.json')); f=json.load(open('followup.json'))
C={"sigmoid":"#2a78d6","tanh":"#eb6834","relu":"#1baf7a","leakyrelu":"#eda100","elu":"#e87ba4","swish":"#008300"}
N={"sigmoid":"Sigmoid","tanh":"Tanh","relu":"ReLU","leakyrelu":"LeakyReLU","elu":"ELU","swish":"Swish"}
plt.rcParams.update({'font.family':'Carlito','font.size':9.5,'axes.edgecolor':'#9a9a9a','axes.linewidth':0.6,
  'xtick.color':'#5a5a5a','ytick.color':'#5a5a5a','axes.labelcolor':'#4a4a4a','text.color':'#3a3a3a'})
fig,axs=plt.subplots(1,2,figsize=(7.2,2.15),sharey=True)
ep=range(1,16)
for ax,key,title in [(axs[0],'shallow','(a) 4 hidden layers (notebook network)'),(axs[1],'deep','(b) 10 hidden layers, default PyTorch init')]:
    for a in C:
        ax.plot(ep,r[key][a]['train_loss'],color=C[a],lw=1.8,label=N[a],solid_capstyle='round')
    ax.set_title(title,fontsize=9,loc='left',color='#2C4A6E',fontweight='bold')
    ax.set_xlabel('Epoch'); ax.grid(axis='y',color='#e6e6e6',lw=0.6); ax.set_axisbelow(True)
    for s in ('top','right'): ax.spines[s].set_visible(False)
    ax.set_xticks([1,5,10,15]); ax.set_ylim(0,2.45)
for a,ls in [('relu',(0,(4,2))),('swish',(0,(1.5,1.5)))]:
    axs[1].plot(ep,f[a]['train_loss'],color=C[a],lw=1.6,ls=ls,label=f'{N[a]} + He init')
axs[0].set_ylabel('Training loss (cross-entropy)')
axs[1].annotate('Sigmoid, ReLU, Swish stuck at ln(10)',xy=(6,2.30),xytext=(2.2,1.75),fontsize=7.5,color='#4a4a4a',
    arrowprops=dict(arrowstyle='-',color='#9a9a9a',lw=0.6))
axs[1].annotate('same nets with He init',xy=(4,0.34),xytext=(6.5,0.75),fontsize=7.5,color='#4a4a4a',
    arrowprops=dict(arrowstyle='-',color='#9a9a9a',lw=0.6))
h,l=axs[1].get_legend_handles_labels()
fig.legend(h,l,loc='lower center',ncol=8,frameon=False,fontsize=7.5,bbox_to_anchor=(0.5,-0.02),handlelength=2.2,columnspacing=1.1)
fig.tight_layout(rect=(0,0.08,1,1))
fig.savefig('curves.png',dpi=250,bbox_inches='tight',facecolor='white')
