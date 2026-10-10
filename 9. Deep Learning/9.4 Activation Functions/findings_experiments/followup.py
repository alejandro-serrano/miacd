# Follow-up: is the deep ReLU/Swish plateau caused by the default PyTorch init?
# Re-train the 10-hidden-layer nets with proper He (Kaiming normal, fan_in, relu gain) init,
# and measure how the forward signal std shrinks with depth at init.
import json, sys, torch, torch.nn as nn
sys.argv=['x']
exec(open('activation_experiments.py').read().split('results = {"shallow"')[0])
def he_init(net):
    for m in net.modules():
        if isinstance(m, nn.Linear):
            nn.init.kaiming_normal_(m.weight, nonlinearity='relu'); nn.init.zeros_(m.bias)
def signal_std(net):
    net.eval(); h=Xtr[:1024].view(1024,-1); out=[]
    with torch.no_grad():
        for l in net.layers[:-1]:
            h=l(h)
            if isinstance(l, Act): out.append(h.std().item())
    return out
DEEP=[256]*5+[128]*5
res={}
for name in ACTS:
    set_seed(42); net=BaseNetwork(ACTS[name](), DEEP); s_def=signal_std(net)
    set_seed(42); net=BaseNetwork(ACTS[name](), DEEP); he_init(net); s_he=signal_std(net); g_he=grad_stats(net)
    entry={"std_default":s_def,"std_he":s_he,"grad_he":g_he}
    if name in ("relu","leakyrelu","swish"):
        set_seed(42); net=BaseNetwork(ACTS[name](), DEEP); he_init(net); h=train(net); entry.update(h)
        print(name,'He test',h['test_acc'],'loss',[round(x,3) for x in h['train_loss']],flush=True)
    res[name]=entry
    print(name,'std default',[round(x,3) for x in s_def]); print('   std He',[round(x,3) for x in s_he]); print('   grad He',['%.1e'%g for g in g_he],flush=True)
json.dump(res,open('followup.json','w'),indent=1)
